import { extractUri } from 'osnack-frontend-shared/src/_core/appFunc';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import { useDeleteNewsletter } from 'osnack-frontend-shared/src/hooks/PublicHooks/useNewsletterHook';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useHistory } from 'react-router-dom';

const Unsubscribe = (props: IProps) => {
   const [key, setKey] = useState(extractUri(window.location.pathname)[1]);
   const errorAlert = useAlert(new AlertObj());
   const history = useHistory();

   useEffect(() => {
      useDeleteNewsletter(key).then(result => { setKey(""); errorAlert.setSingleSuccess("", result.data); }).catch(alert => errorAlert.set(alert));
   }, []);
   return (
      <Container>
         <Alert alert={errorAlert.alert}
            className="col-12"
            onClosed={() => { errorAlert.clear(); history.push("/"); }}
         />
      </Container>
   );
};

declare type IProps = {
};
export default Unsubscribe;
