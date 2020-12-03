import React, { useEffect, useRef, useState } from 'react';
import { useUpdateCurrentUserUser, useUpdateCurrentUserPasswordUser } from '../../hooks/apiHooks/useUserHook';
import { User, RegistrationTypes } from '../../_core/apiModels';
import { enumToArray, sleep } from '../../_core/appFunc';
import { CommonRegex } from '../../_core/constant.Variables';
import { Button } from '../Buttons/Button';
import { Input } from '../Inputs/Input';
import ConfirmPasswordModal from '../Modals/ConfirmPasswordModal';
import Alert, { AlertObj, AlertTypes, ErrorDto } from '../Texts/Alert';

const UserAccount = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [alertAccountInfo, setAlertAccountInfo] = useState(new AlertObj());
   const [alertPasswordInfo, setAlertPasswordInfo] = useState(new AlertObj());
   const [user, setUser] = useState(props.user);
   const [confirmPassword, setConfirmPassword] = useState("");
   const [currentPassword, setCurrentPassword] = useState("");
   const [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState(false);
   const [selectedAction, setSelectedAction] = useState("");
   const isExternalLogin = props.user.registrationMethod?.type !== RegistrationTypes.Application;

   useEffect(() => () => { isUnmounted.current = true; }, []);

   const onDetailsChange = (currentPass: string) => {
      if (currentPass == "" && user.registrationMethod.type == RegistrationTypes.Application) {
         setIsOpenConfirmPassword(true);
         setSelectedAction("Details");
         return;
      }

      setAlertPasswordInfo(alertPasswordInfo.Clear);

      sleep(500, isUnmounted).then(() => { setAlertAccountInfo(alertAccountInfo.PleaseWait); });
      setIsOpenConfirmPassword(false);
      useUpdateCurrentUserUser({ user: user, currentPassword: currentPass }).then((user) => {
         if (isUnmounted.current) return;
         setIsOpenConfirmPassword(true);
         setSelectedAction("Details");
         setCurrentPassword("");
      }).catch((alert) => {
         if (isUnmounted.current) return;
         setAlertAccountInfo(alert);
      });


      //useEditCurrentUser(user, currentPass).then(result => {
      //   if (isUnmounted.current) return;
      //   if (result.resetCurrentPasswordValue) {
      //      setIsOpenConfirmPassword(true);
      //      setSelectedAction("Details");
      //      setCurrentPassword("");
      //   }
      //   else if (result.alert.List.length > 0) {
      //      alertAccountInfo.List = result.alert.List;
      //      alertAccountInfo.Type = result.alert.Type;
      //      setAlertAccountInfo(alertAccountInfo);
      //   }
      //   else { //TODO
      //      setAlertAccountInfo(alertAccountInfo.addSingleSuccess("Updated"));
      //   }
      //});

      setCurrentPassword(currentPass);
      setSelectedAction("");
   };
   const onConfirmPassword = (currentPass: string) => {
      if (isExternalLogin) return;

      if (currentPass == "") {
         setIsOpenConfirmPassword(true);
         setSelectedAction("Password");
         return;
      }

      let errors = new AlertObj([], AlertTypes.Error);
      if ((user.password || "") == "")
         errors.List.push(new ErrorDto('0', "Password Is Required"));
      else if (user.password !== confirmPassword)
         errors.List.push(new ErrorDto('0', "Passwords mismatch."));

      setIsOpenConfirmPassword(false);
      setAlertAccountInfo(alertAccountInfo.Clear);

      if (errors.List.length > 0) {
         setAlertPasswordInfo(errors);
         return;
      }
      else {
         sleep(500, isUnmounted).then(() => { setAlertPasswordInfo(alertPasswordInfo.PleaseWait); });
      }

      setCurrentPassword(currentPass);
      setSelectedAction("");

      sleep(500, isUnmounted).then(() => { setAlertPasswordInfo(alertPasswordInfo.PleaseWait); });
      useUpdateCurrentUserPasswordUser({ user: user, currentPassword: currentPass }).then((user) => {
         if (isUnmounted.current) return;
         setIsOpenConfirmPassword(true);
         setSelectedAction("Password");
         setCurrentPassword("");
      }).catch((alert) => {
         setAlertPasswordInfo(alert);
      });

      //useEditCurrentUserPassword(user, currentPass).then(result => {
      //   if (isUnmounted.current) return;
      //   if (result.resetCurrentPasswordValue) {
      //      setIsOpenConfirmPassword(true);
      //      setSelectedAction("Password");
      //      setCurrentPassword("");
      //   }
      //   else if (result.alert.List.length > 0) {
      //      alertPasswordInfo.List = result.alert.List;
      //      alertPasswordInfo.Type = result.alert.Type;
      //      setAlertPasswordInfo(alertPasswordInfo);
      //   }
      //   else {  //TODO
      //      setUser({ ...user, Password: "" });  
      //      setConfirmPassword("");
      //      setAlertPasswordInfo(alertPasswordInfo.addSingleSuccess("Updated"));
      //   }
      //});
   };

   const getRegistrationType = () => {
      let regType = user.registrationMethod?.type;
      if (regType != null && regType != RegistrationTypes.Application) {
         let typeList = enumToArray(RegistrationTypes);
         return `Linked to ${typeList.find(i => i.name == regType)?.name} account`;
      }
      return "";
   };

   return (
      <div className="row">
         <div className="row col-12 col-md-6 m-0">
            <Input label="Name"
               showDanger={alertAccountInfo.checkExist("firstName")}
               value={user.firstName}
               className="col-12"
               onChange={(i) => { setUser({ ...user, firstName: i.target.value }); }}
            />
            <Input label="Surname"
               value={user.surname}
               showDanger={alertAccountInfo.checkExist("surname")}
               className="col-12"
               onChange={(i) => { setUser({ ...user, surname: i.target.value }); }}
            />
            <Input label="Phone Number"
               className="col-12"
               type="text"
               value={user.phoneNumber || undefined}
               showDanger={alertAccountInfo.checkExist("phoneNumber")}
               validationPattern={CommonRegex.UkNumber}
               onChange={i => setUser({ ...user, phoneNumber: i.target.value })}
            />
            {!isExternalLogin &&
               <Input label={`Email ${user.emailConfirmed ? "(Verified)" : "(Not Verified)"}`}
                  value={user.email}
                  type="email"
                  showValid={user.emailConfirmed || alertAccountInfo.checkExist("email")}
                  showDanger={!user.emailConfirmed}
                  className="col-12"
                  onChange={(i) => { setUser({ ...user, email: i.target.value }); }}
               />
            }
            <Alert alert={alertAccountInfo} onClosed={() => setAlertAccountInfo(new AlertObj())} />
            <div className="col-12">
               <Button children="Confirm Changes"
                  className="col-auto btn-lg btn-green"
                  onClick={() => { onDetailsChange(currentPassword); }}
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
                     showDanger={alertPasswordInfo.checkExist("passwordhash")}
                     onChange={i => setUser({ ...user, password: i.target.value })}
                  />

                  <Input label={"Confirm Password*"}
                     type="password"
                     value={confirmPassword}
                     className="col-12" key="confirmPassword"
                     showDanger={alertPasswordInfo.checkExist("passwordhash")}
                     onChange={i => setConfirmPassword(i.target.value)}
                  />

                  <Alert alert={alertPasswordInfo} onClosed={() => setAlertPasswordInfo(new AlertObj())} />
                  <div className="col-12">
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
            onSuccess={(currentPassword) => {
               if (selectedAction == "Details")
                  onDetailsChange(currentPassword);
               if (selectedAction == "Password")
                  onConfirmPassword(currentPassword);
            }}
            onCancel={() => {
               setSelectedAction("");
               setAlertPasswordInfo(new AlertObj());
               setAlertAccountInfo(new AlertObj());
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
