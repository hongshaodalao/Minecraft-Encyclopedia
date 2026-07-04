#!/usr/bin/env python3
"""
Minecraft 图鉴 TTS 语音生成脚本

使用 mimo-v2.5-tts 模型为所有词条生成语音

用法:
  python scripts/generate-tts.py                 # 生成所有词条语音
  python scripts/generate-tts.py --clear          # 清除现有语音后重新生成
  python scripts/generate-tts.py --id grass       # 只生成指定词条
"""

import os
import sys
import json
import time
import base64
import argparse
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("错误: 请先安装 openai 库")
    print("运行: pip install openai")
    sys.exit(1)


# 配置
API_KEY = "sk-chcam1e0av1iplymm9klmb2u38wgpgndicbl2lu0idwcga06"
BASE_URL = "https://api.xiaomimimo.com/v1"
TONE = "温柔亲切的年轻女性"
AUDIO_FORMAT = "wav"


def get_client():
    """初始化 OpenAI 客户端"""
    return OpenAI(api_key=API_KEY, base_url=BASE_URL)


def generate_audio(client, text, output_path):
    """
    生成音频文件

    Args:
        client: OpenAI 客户端
        text: 要转换的文本
        output_path: 输出文件路径

    Returns:
        bool: 是否成功
    """
    try:
        completion = client.chat.completions.create(
            model="mimo-v2.5-tts",
            messages=[
                {
                    "role": "user",
                    "content": TONE
                },
                {
                    "role": "assistant",
                    "content": text
                }
            ],
            audio={
                "format": AUDIO_FORMAT,
                "optimize_text_preview": True
            }
        )

        message = completion.choices[0].message
        audio_bytes = base64.b64decode(message.audio.data)

        # 确保输出目录存在
        os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

        with open(output_path, "wb") as f:
            f.write(audio_bytes)

        return True

    except Exception as e:
        print(f"  [FAIL] 生成失败: {e}")
        return False


def clear_audio_directory(audio_dir):
    """清除音频目录中的所有文件"""
    if not audio_dir.exists():
        return 0

    count = 0
    for file in audio_dir.glob("*"):
        if file.is_file():
            file.unlink()
            count += 1

    return count


def load_entries(entries_path):
    """加载词条数据"""
    with open(entries_path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(description="为 Minecraft 图鉴词条生成 TTS 语音")
    parser.add_argument("--clear", action="store_true", help="清除现有语音后重新生成")
    parser.add_argument("--id", type=str, help="只生成指定词条的语音")
    parser.add_argument("--dry-run", action="store_true", help="只显示将要生成的词条，不实际生成")
    args = parser.parse_args()

    # 路径配置
    root = Path(__file__).parent.parent
    entries_path = root / "src" / "data" / "entries.json"
    audio_dir = root / "public" / "audio"

    # 加载词条
    entries = load_entries(entries_path)
    print(f"[BOOK] 加载了 {len(entries)} 个词条")

    # 清除现有语音
    if args.clear:
        cleared = clear_audio_directory(audio_dir)
        print(f"[DELETE] 已清除 {cleared} 个语音文件")

    # 创建音频目录
    audio_dir.mkdir(parents=True, exist_ok=True)

    # 过滤词条
    if args.id:
        entries = [e for e in entries if e["id"] == args.id]
        if not entries:
            print(f"[ERROR] 未找到词条: {args.id}")
            sys.exit(1)

    # 初始化客户端
    client = get_client()
    print(f"[MIC] 初始化 mimoTTS 客户端")
    print(f"   音色: {TONE}")
    print(f"   格式: {AUDIO_FORMAT}")
    print()

    # 生成语音
    success = 0
    failed = 0
    skipped = 0

    for i, entry in enumerate(entries):
        entry_id = entry["id"]
        audio_id = entry.get("audio", entry_id)
        audio_text = entry.get("audioText", "")
        name = entry.get("name", entry_id)

        # 输出文件路径
        output_path = audio_dir / f"{audio_id}.{AUDIO_FORMAT}"

        # 检查是否已存在
        if output_path.exists() and not args.clear:
            print(f"[{i+1}/{len(entries)}] {name} ({entry_id}) ... [SKIP] 已存在")
            skipped += 1
            continue

        # 检查是否有 audioText
        if not audio_text:
            print(f"[{i+1}/{len(entries)}] {name} ({entry_id}) ... [WARN] 无 audioText")
            failed += 1
            continue

        # 显示进度
        print(f"[{i+1}/{len(entries)}] {name} ({entry_id})")
        print(f"  文本: {audio_text[:50]}...")

        if args.dry_run:
            print(f"  → {output_path}")
            success += 1
            continue

        # 生成语音
        if generate_audio(client, audio_text, output_path):
            print(f"  [OK] 已生成: {output_path.name}")
            success += 1
        else:
            failed += 1

        # 限速：避免 API 过载
        time.sleep(0.5)

    # 统计结果
    print()
    print("=" * 50)
    print(f"[STATS] 生成完成:")
    print(f"   [OK] 成功: {success}")
    print(f"   [SKIP] 跳过: {skipped}")
    print(f"   [FAIL] 失败: {failed}")
    print(f"   [DIR] 输出目录: {audio_dir}")


if __name__ == "__main__":
    main()
