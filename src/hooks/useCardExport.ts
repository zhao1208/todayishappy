import { useCallback } from 'react';
import { Toast } from 'antd-mobile';

export function useCardExport() {
  const exportCard = useCallback(async (canvas: HTMLCanvasElement, filename: string = '今天也没废-许可证') => {
    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });
      if (!blob) {
        Toast.show({ content: '导出失败，请重试', position: 'center' });
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Toast.show({ content: '已保存到相册', icon: 'success', position: 'center' });
    } catch (e) {
      Toast.show({ content: '保存失败', position: 'center' });
    }
  }, []);

  return { exportCard };
}
