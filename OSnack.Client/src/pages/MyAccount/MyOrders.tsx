
import ViewOrders from 'osnack-frontend-shared/src/pages/Order/ViewOrders';
import { Communication, Order } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { useState } from 'react';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';
import AddDisputeModal from './AddDisputeModal';
import DisputeModal from './DisputeModal';
const MyOrders = (props: IProps) => {
   const [selectedOrder, setSelectedOrder] = useState(new Order());
   const [selectedDispute, setSelectedDispute] = useState(new Communication());
   const [isOpenAddDisputeModalModal, setIsOpenAddDisputeModalModal] = useState(false);
   const [isOpenDisputeModalModal, setIsOpenDisputeModalModal] = useState(false);
   return (
      <Container>
         <ViewOrders access={Access}
            onDispute={(order) => { setIsOpenAddDisputeModalModal(true); setSelectedOrder(order); }}
            onShowDispute={(dispute) => { setIsOpenDisputeModalModal(true); setSelectedDispute(dispute); }}
         />

         <AddDisputeModal isOpen={isOpenAddDisputeModalModal}
            order={selectedOrder}
            onClose={() => { setIsOpenAddDisputeModalModal(false); }}
         />
         <DisputeModal isOpen={isOpenDisputeModalModal}
            dispute={selectedDispute}
            onClose={() => { setIsOpenDisputeModalModal(false); }}
         />
      </Container>
   );
};

declare type IProps = {
};
export default MyOrders;
