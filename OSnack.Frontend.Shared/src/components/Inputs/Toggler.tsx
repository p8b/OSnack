import React, { useEffect, useState } from 'react';

export const Toggler = (props: IProps) => {
    const [key] = useState(Math.random().toString());
    const [lblValue, setLblValue] = useState("");

    useEffect(() => {
        if (props.value)
            setLblValue(props.lblValueTrue);
        else
            setLblValue(props.lblValueFalse);
    }, [props.value]);

    return (
        <div className={`toggler ${props!.className!}`}>
            <div onClick={() => document.getElementById(`${key}`)?.click()}>
                <input type="checkbox" id={key} required={props!.required}
                    checked={props.value}
                    onChange={i => { props!.onChange!(i.target.checked); }}
                //    disabled={props!.disabled}
                />
                <span />
            </div>
            <label className={`dark ${props.lblClassName || ""}`}
                onClick={() => document.getElementById(`${key}`)?.click()}>
                {lblValue}
            </label>
        </div>
    );
};

declare type IProps = {
    value: boolean;
    className?: string;
    required?: boolean;
    // disabled?: boolean;
    lblValueTrue: string;
    lblValueFalse: string;
    lblClassName?: string;
    onChange: (checked: boolean) => void;
};
