import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { extractUri, setHtmlTitle } from '../../_core/appFunc';
const NavLink = (props: IProps) => {
   const [linkRef] = useState(React.createRef<HTMLAnchorElement>());
   const history = useHistory();
   useEffect(() => {
      if (extractUri()[0]?.toLowerCase() == extractUri(undefined, props.path)[0]?.toLowerCase())
         linkRef.current?.classList.add("visited");
      else
         linkRef.current?.classList.remove("class", "visited");
   }, [window.location.pathname]);

   return (
      <a ref={linkRef}
         className={`link-nav ${props.className || ""}`}
         onClick={() => {
            props.onClick && props.onClick!();
            setHtmlTitle(props.displayName);
            history.push(props.path);
         }}>
         <div className="col-12 mx-auto text-center mb-0">{props.displayName}</div>
         <span className="row pm-0" />
      </a>
   );
};

declare type IProps = {
   className?: string;
   displayName: string;
   path: string;
   onClick?: () => void;
};
export default NavLink;
