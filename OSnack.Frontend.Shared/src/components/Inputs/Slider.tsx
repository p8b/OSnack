import React from 'react';

const Slider = (props: IProps) => {
   return (
      <div className={`w-100 ${props.className}`}>
         <input type="range" min={props.min} max={props.max} step={props.step} defaultValue={props.value} className="slider"
            onChange={(i) => { props.onChange(i.target.value as unknown as number); }} />
      </div>
   );
};

declare type IProps = {
   min: number;
   max: number;
   step: number;
   value: number;
   className?: string;
   onChange: (value: number) => void;
};

export default Slider;