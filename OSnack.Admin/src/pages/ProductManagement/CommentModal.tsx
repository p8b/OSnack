import React, { useEffect, useRef, useState } from 'react';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { StarRating } from 'osnack-frontend-shared/src/components/Inputs/StarRating';
import { Comment } from 'osnack-frontend-shared/src/_core/apiModels';
import { useAllComment } from '../../SecretHooks/useCommentHook';
import AddReplyModal from './AddReplyModal';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';




const CommentModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [commentList, setCommentList] = useState<Comment[]>([]);
   const [isOpenReplyModal, setIsOpenReplyModal] = useState(false);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(5);
   const [selectedComment, setSelectedComment] = useState(new Comment());

   useEffect(() => {
      return () => { isUnmounted.current = true; };
   }, []);

   useEffect(() => {
      reload();
   }, [props.productId]);

   const reload = (selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage) => {

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (maxItemsPerPage != tblMaxItemsPerPage) {
         setTblMaxItemsPerPage(maxItemsPerPage);
         selectedPage = 1;
      }


      errorAlert.PleaseWait(500, isUnmounted);
      useAllComment(props.productId, selectedPage, maxItemsPerPage).then(result => {
         if (isUnmounted.current) return;
         setCommentList(result.data.commentList!);
         setTblTotalItemCount(result.data.totalCount!);
      }
      ).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };


   const addReply = (comment: Comment) => {
      setSelectedComment(comment);
      setIsOpenReplyModal(true);
   };

   return (
      <Modal className="col-11 col-sm-10 col-lg-8 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title="Comments" />
            <div className=" mt-1">
               <div className="col-12 pm-0">
                  {commentList!.map(comment => {
                     return (
                        <div key={comment.id} className="comment">
                           <div className="row">
                              <div className="col-6 small-text text-gray">{comment.name}</div>
                              <div className="col-6">
                                 <StarRating className="float-right" rate={comment.rate} readonly />
                              </div>
                           </div>
                           <div className="col-12">{comment.description}</div>
                           {comment.reply &&
                              <div className="reply">
                                 <div className="col-12 row small-text text-gray" children="Customer Support" />
                                 <div className="col-12">{comment.reply}</div>
                              </div>
                           }
                           <Button children={`${comment.reply ? "Edit Reply" : "Add Reply"}`} className="btn-sm"
                              onClick={() => addReply(comment)} />
                        </div>

                     );
                  })
                  }
               </div>
               {/***** buttons ****/}
               <div className="col-12 pm-0 pos-b-sticky bg-white pb-3">
                  <Pagination
                     maxItemsPerPage={tblMaxItemsPerPage}
                     selectedPage={tblSelectedPage}
                     listCount={tblTotalItemCount}
                     onChange={(selectedPage, maxItemsPerPage) => { reload(selectedPage, maxItemsPerPage); }}
                  />
                  <Button children="Close"
                     className="col-12  mt-2 btn-white btn-lg"
                     onClick={() => { props.onClose(); }} />
               </div>
            </div>

            <AddReplyModal isOpen={isOpenReplyModal} comment={selectedComment}
               onClose={() => { setSelectedComment(new Comment()); setIsOpenReplyModal(false); reload(); }} />
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
