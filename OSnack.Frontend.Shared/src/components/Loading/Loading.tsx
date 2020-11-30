
import React from 'react';
export const Loading = (props: IProps) => {
    return (
        <div className="row justify-content-center">
            <img style={{ width: "3rem", height: "3rem" }} src="/public/images/LoadSpinner.gif" alt="." />
        </div>
    );
};

declare type IProps = {
};
