import React, { useEffect, useRef, useState } from 'react';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { StarRating } from 'osnack-frontend-shared/src/components/Inputs/StarRating';
import { Toggler } from 'osnack-frontend-shared/src/components/Inputs/Toggler';
import { Comment } from 'osnack-frontend-shared/src/_core/apiModels';
import { useAllComment, usePutComment } from '../../SecretHooks/useCommentHook';




const CommentModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [commentList, setCommentList] = useState<Comment[]>([]);


   useEffect(() => {
      reload();
   }, [props.productId]);

   const reload = () => {
      useAllComment(props.productId).then(result => {
         if (isUnmounted.current) return;
         setCommentList(result.data);
      }
      ).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };

   const changeShow = (commenId: number, show: boolean) => {
      usePutComment(commenId, show).then(result => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         reload();
         errorAlert.setSingleSuccess("success", result.data);
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };
   return (
      <Modal className="col-11 col-sm-10 col-lg-6 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title="Comments" />
            <div className=" mt-1">
               <div className="col-12 pm-0">
                  {commentList!.map(comment => {
                     return (
                        <div key={comment.id} className="comment">
                           <Toggler
                              className="toggler-xlg circle col-12 pb-3"
                              lblValueTrue="Comment Show"
                              lblValueFalse="Comment Hide"
                              value={comment.show!}
                              onChange={(i) => changeShow(comment.id!, i)}
                           />
                           <div className="row">
                              <div className="col-12 col-sm-6">{comment.name}</div>
                              <StarRating className="col-auto ml-auto" rate={comment.rate} />
                           </div>
                           <div className="col-12">{comment.description}</div>
                        </div>
                     );
                  })
                  }
               </div>
               {/***** buttons ****/}
               <div className="col-12 pm-0 pos-b-sticky bg-white pb-3">

                  <Button children="Close"
                     className="col-12  mt-2 btn-white btn-lg"
                     onClick={() => { props.onClose(); }} />
               </div>
            </div>
         </>
      </Modal >

   );

};

declare type IProps = {
   productId: number;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;

};
export default CommentModal;
