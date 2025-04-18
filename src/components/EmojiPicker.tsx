'use client';

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import React from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: { native: string }) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  return (
    <div className="absolute bottom-24 right-20 z-10">
      <Picker data={data} onEmojiSelect={onSelect} />
    </div>
  );
};

export default EmojiPicker;
