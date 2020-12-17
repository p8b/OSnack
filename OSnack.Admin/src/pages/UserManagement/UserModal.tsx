import React, { useEffect, useRef, useState } from 'react';
import { RegistrationTypes, RegistrationTypesList, Role, User } from 'osnack-frontend-shared/src/_core/apiModels';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useCreateUserUser, useUpdateUserUser, useDeleteUser } from '../../SecretHooks/useUserHook';
import InputDropdown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';

const UserModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [user, setUser] = useState(new User());

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      setUser(props.user);
   }, [props.user]);

   const createUser = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useCreateUserUser(user).then(result => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         setUser(result.data);
         props.onSuccess();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   const updateUser = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      console.log(user);
      useUpdateUserUser(user).then(result => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         setUser(result.data);
         props.onSuccess();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   const deleteUser = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useDeleteUser(user).then(() => {
         if (isUnmounted.current) return;
         errorAlert.setSingleSuccess("", "confirm");
         setUser(user);
         props.onSuccess();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };

   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title={`${user.id === 0 ? "New" : "Update"} User`} />

         {/***** Name & Surname ****/}
         <div className="row">
            <Input label="Name"
               showDanger={errorAlert.checkExistFilterRequired("FirstName")}
               value={user.firstName}
               onChange={i => { setUser({ ...user, firstName: i.target.value }); }}
               className="col-12 col-sm-6" />
            <Input label="Surname"
               showDanger={errorAlert.checkExistFilterRequired("Surname")}
               value={user.surname}
               onChange={i => { setUser({ ...user, surname: i.target.value }); }}
               className="col-12 col-sm-6" />
         </div>
         {/***** Phone & Role ****/}
         <div className="row">
            <Input label={`Phone No.`}
               value={user.phoneNumber}
               showDanger={errorAlert.checkExistFilterRequired("PhoneNumber")}
               onChange={i => { setUser({ ...user, phoneNumber: i.target.value }); }}
               className="col-12 col-sm-6" />
            <InputDropdown dropdownTitle={user.role?.name || "Select Option"}
               label="Role*"
               showDanger={errorAlert.checkExistFilterRequired("Role")}
               className="col-12 col-sm-6 " >
               {props.roleList.map(role =>
                  <button className="dropdown-item" key={role.id}
                     onClick={() => { setUser({ ...user, role: role }); }} >
                     {role.name}
                  </button>
               )}
            </InputDropdown>
         </div>

         {/***** Email & Registration Type ****/}
         <div className="row">
            <Input label={`Email ${user.id && user.id > 0 ? (user.emailConfirmed ? "(Verified)" : "(Not Verified)") : ""}`}
               value={user.email}
               disabled={user.registrationMethod?.type != null}
               showDanger={errorAlert.checkExistFilterRequired("Email")}
               onChange={i => { setUser({ ...user, email: i.target.value }); }}
               className="col-12 col-sm-6" />
            <Input label={`Registration Method`}
               value={RegistrationTypesList.find((rm) => rm.Value === user.registrationMethod.type || rm.Value === RegistrationTypes.Application)?.Name}
               onChange={i => { }}
               disabled
               className="col-12 col-sm-6" />
         </div>

         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />

         {/***** buttons ****/}
         <div className="row col-12 pm-0 ">
            {user.id === 0 ?
               <Button children="Create"
                  className="col-12 mt-2 btn-green col-sm-6 btn-lg"
                  onClick={createUser} />
               :
               <div className="row col-12 col-sm-8 pm-0">
                  <ButtonPopupConfirm title="Update"
                     popupMessage="Are you sure?"
                     className="col-12 mt-2 col-sm-6"
                     btnClassName="btn-green"
                     onConfirmClick={updateUser}
                  />
                  <ButtonPopupConfirm title="Delete"
                     popupMessage="Are you sure?"
                     className="col-12 col-sm-6 mt-2"
                     btnClassName="btn-red"
                     onConfirmClick={deleteUser}
                  />
               </div>
            }
            <Button children="Cancel"
               className={`col-12 mt-2 btn-white btn-lg ${user.id === 0 ? "col-sm-6" : "col-sm-4"}`}
               onClick={() => { errorAlert.clear(); props.onClose(); }} />
         </div>
      </Modal >
   );
};

declare type IProps = {
   user: User;
   roleList: Role[];
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   modalRef?: any;
};
export default UserModal;
