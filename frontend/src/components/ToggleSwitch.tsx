import React from 'react';
import './ToggleSwitch.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <div className="toggle">
      <div className="btn-container">
        <label className="switch btn-color-mode-switch">
          <input
            type="checkbox"
            name="color_mode"
            id="color_mode"
            checked={checked}
            onChange={onChange} 
          />
          <label
            htmlFor="color_mode"
            data-on="Sell"
            data-off="Lease"
            className="btn-color-mode-switch-inner"
          ></label>
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
