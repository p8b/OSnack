import React, { useEffect, useState } from 'react';
import { Role, User } from 'osnack-frontend-shared/src/_core/apiModels';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import Alert, { AlertObj } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useCreateUser } from '../../hooks/apiCallers/user/Post.User';
import { useModifyUser } from '../../hooks/apiCallers/user/Put.User';
import { useDeleteUser } from '../../hooks/apiCallers/user/Delete.User';
import InputDropdown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { enumToArray, sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import { RegistrationTypes } from 'osnack-frontend-shared/src/_core/constant.Variables';

const UserModal = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [user, setUser] = useState(new User());
   const [registrationMethodList] = useState(enumToArray(RegistrationTypes));

   useEffect(() => {
      setUser(props.user);
   }, [props.user]);

   const createUser = async () => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useCreateUser(user).then(result => {

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setAlert(alert.Clear);
            props.onSuccess();
         }
      });
   };
   const updateUser = async () => {

      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useModifyUser(user).then(result => {

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            props.onSuccess();
            setAlert(alert.Clear);
         }
      });
   };
   const deleteUser = async () => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useDeleteUser(user).then(result => {

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            props.onSuccess();
            setAlert(alert.Clear);
         }
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
               showDanger={alert.checkExistFilterRequired("FirstName")}
               value={user.firstName}
               onChange={i => { setUser({ ...user, firstName: i.target.value }); }}
               className="col-12 col-sm-6" />
            <Input label="Surname"
               showDanger={alert.checkExistFilterRequired("Surname")}
               value={user.surname}
               onChange={i => { setUser({ ...user, surname: i.target.value }); }}
               className="col-12 col-sm-6" />
         </div>
         {/***** Phone & Role ****/}
         <div className="row">
            <Input label={`Phone No.`}
               value={user.phoneNumber}
               showDanger={alert.checkExistFilterRequired("PhoneNumber")}
               onChange={i => { setUser({ ...user, phoneNumber: i.target.value }); }}
               className="col-12 col-sm-6" />
            <InputDropdown dropdownTitle={user.role?.name || "Select Option"}
               label="Role*"
               showDanger={alert.checkExistFilterRequired("Role")}
               className="col-12 col-sm-6 " >
               {props.roleList.map(role =>
                  <div className="dropdown-item" key={role.id}
                     onClick={() => { setUser({ ...user, role: role }); }} >
                     {role.name}
                  </div>
               )}
            </InputDropdown>
         </div>

         {/***** Email & Registration Type ****/}
         <div className="row">
            <Input label={`Email ${user.id > 0 ? (user.emailConfirmed ? "(Verified)" : "(Not Verified)") : ""}`}
               value={user.email}
               disabled={user.registrationMethod?.type != 0}
               showDanger={alert.checkExistFilterRequired("Email")}
               onChange={i => { setUser({ ...user, email: i.target.value }); }}
               className="col-12 col-sm-6" />
            <Input label={`Registration Method`}
               value={registrationMethodList.find((rm) => rm.id.toString() === user.registrationMethod?.type?.toString())?.name}
               onChange={i => { }}
               disabled
               className="col-12 col-sm-6" />
         </div>

         <Alert alert={alert}
            className="col-12 mb-2"
            onClosed={() => { setAlert(alert.Clear); }}
         />

         {/***** buttons ****/}
         <div className="row col-12 p-0 m-0 ">
            {user.id === 0 ?
               <Button children="Create"
                  className="col-12 mt-2 btn-green col-sm-6 btn-lg"
                  onClick={createUser} />
               :
               <div className="row col-12 col-sm-8 p-0 m-0">
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
               onClick={() => { setAlert(alert.Clear); props.onClose(); }} />
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
