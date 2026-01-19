import React from 'react';

export function Slider({ value = [0, 50], onValueChange, min = 0, max = 50, step = 1, className }) {
  const [internal, setInternal] = React.useState(value);
  React.useEffect(() => setInternal(value), [value]);

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={internal[1]}
      onChange={(e) => {
        const next = [internal[0], Number(e.target.value)];
        setInternal(next);
        onValueChange && onValueChange(next);
      }}
      className={className}
    />
  );
}

export default Slider;