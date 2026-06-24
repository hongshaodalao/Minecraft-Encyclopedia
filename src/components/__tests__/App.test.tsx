import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

describe('App', () => {
  it('应渲染首页封面', () => {
    render(<App />);
    expect(screen.getByText('我的世界百科全书')).toBeInTheDocument();
    expect(screen.getByText('开始探索')).toBeInTheDocument();
  });

  it('点击开始探索应显示分类页', () => {
    render(<App />);
    fireEvent.click(screen.getByText('开始探索'));
    expect(screen.getByText('选一个看看')).toBeInTheDocument();
    expect(screen.getByText('方块世界')).toBeInTheDocument();
    expect(screen.getByText('可爱动物')).toBeInTheDocument();
    expect(screen.getByText('好吃食物')).toBeInTheDocument();
  });

  it('点击分类应显示词条详情', () => {
    render(<App />);
    fireEvent.click(screen.getByText('开始探索'));
    fireEvent.click(screen.getByText('方块世界'));
    expect(screen.getByText('草方块')).toBeInTheDocument();
  });
});
