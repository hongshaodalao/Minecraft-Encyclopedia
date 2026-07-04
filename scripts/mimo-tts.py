#!/usr/bin/env python3
"""
Mimo TTS 音频生成脚本

使用 mimo-v2.5-tts 模型生成高质量中文语音

用法:
  python scripts/mimo-tts.py --text "豌豆射手。向僵尸发射豌豆。" --output public/audio/peashooter.mp3
  python scripts/mimo-tts.py --text "普通僵尸" --tone "低沉沙哑的成年男性" --output public/audio/zombie.mp3
  python scripts/mimo-tts.py --list plants  # 批量生成所有植物音频
  python scripts/mimo-tts.py --list zombies # 批量生成所有僵尸音频

环境变量:
  MIMO_API_KEY: Mimo API 密钥
"""

import os
import sys
import json
import base64
import argparse
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("错误: 请先安装 openai 库")
    print("运行: pip install openai")
    sys.exit(1)


def get_config_from_skill():
    """从 skill.md 读取配置"""
    skill_path = Path(__file__).parent.parent / ".claude" / "skills" / "mimo-tts" / "SKILL.md"
    if not skill_path.exists():
        return None, None

    with open(skill_path, "r", encoding="utf-8") as f:
        content = f.read()

    api_key = None
    base_url = None

    for line in content.split("\n"):
        line = line.strip()
        if "**API Key**:" in line:
            # 提取反引号中的内容
            parts = line.split("`")
            if len(parts) >= 2:
                api_key = parts[1]
        if "**Base URL**:" in line:
            parts = line.split("`")
            if len(parts) >= 2:
                base_url = parts[1]

    return api_key, base_url


def get_client():
    """初始化 OpenAI 客户端"""
    # 优先从环境变量读取
    api_key = os.environ.get("MIMO_API_KEY")
    base_url = os.environ.get("MIMO_BASE_URL")

    # 如果环境变量没有，从 skill.md 读取
    if not api_key or not base_url:
        skill_key, skill_url = get_config_from_skill()
        if not api_key:
            api_key = skill_key
        if not base_url:
            base_url = skill_url

    if not api_key:
        print("错误: 未找到 API Key")
        print("请在 .claude/skills/mimo-tts/SKILL.md 中配置 API Key")
        print("或设置环境变量: export MIMO_API_KEY=your_api_key")
        sys.exit(1)

    if not base_url:
        base_url = "https://api.xiaomimimo.com/v1"

    return OpenAI(
        api_key=api_key,
        base_url=base_url
    )


def generate_audio(text, tone="温柔亲切的年轻女性", output_path="output.wav", audio_format="wav", api_key=None, base_url=None):
    """
    生成音频文件

    Args:
        text: 要转换的文本
        tone: 音色描述（如 "温柔亲切的年轻女性"、"低沉沙哑的成年男性"）
        output_path: 输出文件路径
        audio_format: 音频格式（wav/mp3）

    Returns:
        bool: 是否成功
    """
    if api_key and base_url:
        client = OpenAI(api_key=api_key, base_url=base_url)
    else:
        client = get_client()

    try:
        completion = client.chat.completions.create(
            model="mimo-v2.5-tts",
            messages=[
                {
                    "role": "user",
                    "content": tone
                },
                {
                    "role": "assistant",
                    "content": text
                }
            ],
            audio={
                "format": audio_format,
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
        print(f"错误: {e}")
        return False


def load_plants_data():
    """加载植物数据"""
    data_path = Path(__file__).parent.parent / "src" / "data" / "pvz1" / "plants.js"
    # 简单解析 JS 文件中的 JSON 数据
    with open(data_path, "r", encoding="utf-8") as f:
        content = f.read()
    # 提取 plants 数组
    start = content.find("[")
    end = content.rfind("]") + 1
    json_str = content[start:end]
    return json.loads(json_str)


def load_zombies_data():
    """加载僵尸数据"""
    data_path = Path(__file__).parent.parent / "src" / "data" / "pvz1" / "zombies.js"
    with open(data_path, "r", encoding="utf-8") as f:
        content = f.read()
    start = content.find("[")
    end = content.rfind("]") + 1
    json_str = content[start:end]
    return json.loads(json_str)


def batch_generate(data_type, tone="温柔亲切的年轻女性", audio_format="wav"):
    """批量生成音频"""
    output_dir = Path(__file__).parent.parent / "public" / "audio"
    output_dir.mkdir(parents=True, exist_ok=True)

    if data_type == "plants":
        items = load_plants_data()
        print(f"=== 批量生成植物音频 ({len(items)} 个) ===\n")
    elif data_type == "zombies":
        items = load_zombies_data()
        print(f"=== 批量生成僵尸音频 ({len(items)} 个) ===\n")
    else:
        print(f"错误: 未知数据类型 '{data_type}'")
        return

    success = 0
    fail = 0

    for item in items:
        item_id = item["id"]
        name = item["name"]
        desc = item.get("description", "")

        text = f"{name}。{desc}" if desc else name
        output_path = output_dir / f"{item_id}.{audio_format}"

        print(f"[生成] {item_id}: {name}")
        print(f"  文本: {text[:50]}...")

        if generate_audio(text, tone, str(output_path), audio_format):
            size = output_path.stat().st_size
            print(f"  成功: {output_path.name} ({size} bytes)")
            success += 1
        else:
            print(f"  失败")
            fail += 1

        print()

    print(f"=== 完成 ===")
    print(f"成功: {success}, 失败: {fail}")


def main():
    parser = argparse.ArgumentParser(description="Mimo TTS 音频生成工具")
    parser.add_argument("--text", "-t", help="要转换的文本")
    parser.add_argument("--tone", default="温柔亲切的年轻女性", help="音色描述 (默认: 温柔亲切的年轻女性)")
    parser.add_argument("--output", "-o", default="output.wav", help="输出文件路径")
    parser.add_argument("--format", "-f", choices=["wav", "mp3"], default="wav", help="音频格式")
    parser.add_argument("--list", "-l", choices=["plants", "zombies"], help="批量生成指定类型的所有音频")

    args = parser.parse_args()

    if args.list:
        batch_generate(args.list, args.tone, args.format)
    elif args.text:
        if generate_audio(args.text, args.tone, args.output, args.format):
            print(f"成功: {args.output}")
        else:
            print("失败")
            sys.exit(1)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
