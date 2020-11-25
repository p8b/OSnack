import React from 'react';

const PageHeader = (props: IProps) => {
   return (
      <div id={props.id} className={`line-header ${props.className}`} children={props.children || props.title} />
   );
};

interface IProps {
   id?: string;
   className?: string;
   title?: any;
   children?: any;
   disabled?: boolean;
}

export default PageHeader;
