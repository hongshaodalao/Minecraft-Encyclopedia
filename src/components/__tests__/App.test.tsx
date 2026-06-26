import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

describe('App', () => {
  it('应渲染首页封面', () => {
    render(<App />);
    expect(screen.getByText('我的世界')).toBeInTheDocument();
    expect(screen.getByText('百科全书')).toBeInTheDocument();
    expect(screen.getByText(/开始探索/)).toBeInTheDocument();
  });

  it('点击开始探索应显示分类页', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/开始探索/));
    expect(screen.getByText('选一个看看')).toBeInTheDocument();
    expect(screen.getByText('方块')).toBeInTheDocument();
    expect(screen.getByText('物品')).toBeInTheDocument();
    expect(screen.getByText('装备')).toBeInTheDocument();
    expect(screen.getByText('怪物')).toBeInTheDocument();
    expect(screen.getByText('动物')).toBeInTheDocument();
  });

  it('点击分类应显示列表页', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/开始探索/));
    fireEvent.click(screen.getByText('方块'));
    expect(screen.getByText('草方块')).toBeInTheDocument();
    expect(screen.getByText('泥土')).toBeInTheDocument();
    expect(screen.getByText('石头')).toBeInTheDocument();
  });

  it('点击词条应显示详情页', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/开始探索/));
    fireEvent.click(screen.getByText('方块'));
    fireEvent.click(screen.getByText('草方块'));
    expect(screen.getByText(/草方块是MC世界最常见的方块/)).toBeInTheDocument();
  });
});
