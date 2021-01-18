import React, { useEffect, useRef, useState } from 'react';
import { useUpdateCurrentUserPasswordUser, useUpdateCurrentUserUser } from '../../hooks/OfficialHooks/useUserHook';
import { User, RegistrationTypes } from '../../_core/apiModels';
import { CommonRegex } from '../../_core/constant.Variables';
import { Button } from '../Buttons/Button';
import { Input } from '../Inputs/Input';
import ConfirmPasswordModal from '../Modals/ConfirmPasswordModal';
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from '../Texts/Alert';

const UserAccount = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlertPasswordInfo = useAlert(new AlertObj());
   const errorAlertAccountInfo = useAlert(new AlertObj());
   const [user, setUser] = useState(props.user);
   const [confirmPassword, setConfirmPassword] = useState("");
   const [currentPassword, setCurrentPassword] = useState("");
   const [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState(false);
   const [selectedAction, setSelectedAction] = useState("");
   const isExternalLogin = props.user.registrationMethod?.type !== RegistrationTypes.Application;

   useEffect(() => () => { isUnmounted.current = true; }, []);

   const onDetailsChange = (currentPass: string, loadingCallBack?: () => void) => {
      if (currentPass == "" && user.registrationMethod.type == RegistrationTypes.Application) {
         setIsOpenConfirmPassword(true);
         setSelectedAction("Details");
         loadingCallBack!();
         return;
      }

      errorAlertPasswordInfo.clear();

      errorAlertAccountInfo.pleaseWait(isUnmounted);
      setIsOpenConfirmPassword(false);
      useUpdateCurrentUserUser({ user: user, currentPassword: currentPass }).then((user) => {
         if (isUnmounted.current) return;
         setSelectedAction("Details");
         setCurrentPassword("");
         errorAlertAccountInfo.setSingleSuccess("Update", "Updated.");
         loadingCallBack!();
      }).catch((alert) => {
         if (isUnmounted.current) return;
         errorAlertAccountInfo.set(alert);
         loadingCallBack!();
      });

      setCurrentPassword(currentPass);
      setSelectedAction("");
   };
   const onConfirmPassword = (currentPass: string, loadingCallBack?: () => void) => {
      if (isExternalLogin) return;

      if (currentPass == "") {
         setIsOpenConfirmPassword(true);
         setSelectedAction("Password");
         loadingCallBack!();
         return;
      }

      let errors = new AlertObj([], AlertTypes.Error);
      if ((user.password || "") == "")
         errors.List.push(new ErrorDto('0', "Password Is Required"));
      else if (user.password !== confirmPassword)
         errors.List.push(new ErrorDto('0', "Passwords mismatch."));

      setIsOpenConfirmPassword(false);
      errorAlertAccountInfo.clear();

      if (errors.List.length > 0) {
         errorAlertPasswordInfo.set(errors);
         loadingCallBack!();
         return;
      }

      setCurrentPassword(currentPass);
      setSelectedAction("");

      errorAlertPasswordInfo.pleaseWait(isUnmounted);
      useUpdateCurrentUserPasswordUser({ user: user, currentPassword: currentPass })
         .then(result => {
            if (isUnmounted.current) return;
            setIsOpenConfirmPassword(true);
            setSelectedAction("Password");
            setCurrentPassword("");
            loadingCallBack!();
         }).catch((alert) => {
            if (isUnmounted.current) return;
            errorAlertPasswordInfo.set(alert);
            loadingCallBack!();
         });
   };

   const getRegistrationType = () => {
      let regType = user.registrationMethod?.type;
      if (regType != null && regType != RegistrationTypes.Application)
         return `Linked to ${RegistrationTypes[regType]} account`;
      return "";
   };

   return (
      <div className="row">
         <div className="row col-12 col-md-6 m-0">
            <Input label="Name"
               showDanger={errorAlertAccountInfo.checkExist("firstName")}
               value={user.firstName}
               className="col-12"
               onChange={(i) => { setUser({ ...user, firstName: i.target.value }); }}
            />
            <Input label="Surname"
               value={user.surname}
               showDanger={errorAlertAccountInfo.checkExist("surname")}
               className="col-12"
               onChange={(i) => { setUser({ ...user, surname: i.target.value }); }}
            />
            <Input label="Phone Number"
               className="col-12"
               type="text"
               value={user.phoneNumber || undefined}
               showDanger={errorAlertAccountInfo.checkExist("phoneNumber")}
               validationPattern={CommonRegex.UkNumber}
               onChange={i => setUser({ ...user, phoneNumber: i.target.value })}
            />
            {!isExternalLogin &&
               <Input label={`Email ${user.emailConfirmed ? "(Verified)" : "(Not Verified)"}`}
                  value={user.email}
                  type="email"
                  showValid={user.emailConfirmed || errorAlertAccountInfo.checkExist("email")}
                  showDanger={!user.emailConfirmed}
                  className="col-12"
                  onChange={(i) => { setUser({ ...user, email: i.target.value }); }}
               />
            }
            <div className="col-12">
               <Alert alert={errorAlertAccountInfo.alert} onClosed={() => errorAlertAccountInfo.clear()} />
               <Button children="Confirm Changes"
                  className="col-auto btn-lg btn-green"
                  onClick={(loadingCallBack) => { onDetailsChange(currentPassword, loadingCallBack); }}
                  enableLoading={isUnmounted}
               />
            </div>
         </div>
         <div className="row col-12 col-md-6 m-0 mt-5 mt-md-0 mb-auto">
            {isExternalLogin &&
               <>
                  <h4 className="col-12" children={getRegistrationType()} />
                  <Input label={`Email`}
                     type="email"
                     value={user.email}
                     showValid={user.emailConfirmed}
                     className="col-12"
                     disabled={isExternalLogin}
                     onChange={() => { }}
                  />
               </>
            }
            {!isExternalLogin &&
               <>
                  <h4 className="col-12" children="Change Password" />
                  <Input label={"Password*"}
                     type="password"
                     value={user.password}
                     className="col-12" key="password"
                     showDanger={errorAlertPasswordInfo.checkExist("passwordhash")}
                     onChange={i => setUser({ ...user, password: i.target.value })}
                  />

                  <Input label={"Confirm Password*"}
                     type="password"
                     value={confirmPassword}
                     className="col-12" key="confirmPassword"
                     showDanger={errorAlertPasswordInfo.checkExist("passwordhash")}
                     onChange={i => setConfirmPassword(i.target.value)}
                  />

                  <div className="col-12">
                     <Alert alert={errorAlertPasswordInfo.alert} onClosed={errorAlertPasswordInfo.clear} />
                     <Button children="Change Password"
                        className="col-auto btn-lg btn-green"
                        onClick={() => { onConfirmPassword(currentPassword); }}
                     />
                  </div>
               </>
            }
         </div>
         <ConfirmPasswordModal
            isOpen={isOpenConfirmPassword}
            onSuccess={(currentPassword, loadingCallBack) => {
               if (selectedAction == "Details")
                  onDetailsChange(currentPassword, loadingCallBack);
               if (selectedAction == "Password")
                  onConfirmPassword(currentPassword, loadingCallBack);
            }}
            onClose={() => {
               setSelectedAction("");
               errorAlertPasswordInfo.clear();
               errorAlertAccountInfo.clear();
               setIsOpenConfirmPassword(false);
            }}
         />
      </div>
   );
};

declare type IProps = {
   user: User;
};
export default UserAccount;
