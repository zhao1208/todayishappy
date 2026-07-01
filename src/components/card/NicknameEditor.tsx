import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input } from 'antd-mobile';

interface NicknameEditorProps {
  currentNickname: string;
  onConfirm: (newNickname: string) => void;
  visible: boolean;
  onClose: () => void;
}

const NicknameEditor: React.FC<NicknameEditorProps> = ({
  currentNickname,
  onConfirm,
  visible,
  onClose,
}) => {
  const [value, setValue] = useState(currentNickname);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      setValue(currentNickname);
      // Auto-focus input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [visible, currentNickname]);

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== currentNickname) {
      onConfirm(trimmed);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="修改昵称"
      content={
        <div style={{ padding: '12px 0 4px' }}>
          <Input
            ref={inputRef}
            placeholder="请输入昵称"
            value={value}
            onChange={(val) => setValue(val)}
            maxLength={12}
            clearable
            style={{
              '--font-size': '15px',
              '--text-align': 'left',
            } as React.CSSProperties}
          />
        </div>
      }
      closeOnAction
      onClose={handleClose}
      actions={[
        {
          key: 'cancel',
          text: '取消',
          onClick: handleClose,
        },
        {
          key: 'confirm',
          text: '确认',
          primary: true,
          onClick: handleConfirm,
        },
      ]}
    />
  );
};

export default NicknameEditor;
