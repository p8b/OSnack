
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React from 'react';
import Container from '../../components/Container';
const About = (props: IProps) => {
   return (
      <Container>
         <PageHeader title="About Us" />
         <div className="row justify-content-center">
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default About;
