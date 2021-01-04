import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Container from '../../components/Container';

const PrivacyPolicy = (props: IProps) => {
   const [policy, setPolicy] = useState("");
   useEffect(() => {
      fetch(`${window.location.origin}/public/markdowns/PrivacyPolicy.md`).then((result) => {
         if (result.status == 200)
            result.text().then(termsAndCondition => {
               setPolicy(termsAndCondition);
            });
      });
   }, []);
   return (
      <Container>
         <PageHeader title="Privacy Policy" />
         <div className="col-12 p-3 mb-3 bg-white ml-auto mr-auto">
            <ReactMarkdown>{policy}</ReactMarkdown>
         </div >
      </Container>
   );
};

declare type IProps = {
};
export default PrivacyPolicy;
