import React, { useState, useEffect, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { RegistrationTypes, RegistrationTypesList, User } from "osnack-frontend-shared/src/_core/apiModels";
import { CommonRegex } from "osnack-frontend-shared/src/_core/constant.Variables";
import PageHeader from "osnack-frontend-shared/src/components/Texts/PageHeader";
import { Input } from "osnack-frontend-shared/src/components/Inputs/Input";
import { CheckBox } from "osnack-frontend-shared/src/components/Inputs/CheckBox";
import { Button } from "osnack-frontend-shared/src/components/Buttons/Button";
import { useCreateCustomerUser } from "osnack-frontend-shared/src/hooks/PublicHooks/useUserHook";
import Modal from "osnack-frontend-shared/src/components/Modals/Modal";
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from "osnack-frontend-shared/src/components/Texts/Alert";

const NewCustomerModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [user, setUser] = useState(new User());
   const [termsAndCondition, setTermsAndCondition] = useState(false);
   const [confirmPassword, setConfirmPassword] = useState("");
   const [redirectToMain, setRedirectToMain] = useState(false);
   const history = useHistory();
   let externalLogin = false;

   useEffect(() => () => { isUnmounted.current = true; }, []);
   useEffect(() => {
      if (props.newUser !== undefined) setUser(props.newUser);
      setTermsAndCondition(false);
   }, [props.newUser]);

   const createNewCustomer = async () => {
      let errors = [];
      if ((user.firstName || "") === "")
         errors.push(new ErrorDto("firstName", "Name is required"));
      if ((user.surname || "") === "")
         errors.push(new ErrorDto("surname", "Surname is required"));
      if ((user.email || "") === "")
         errors.push(new ErrorDto("email", "Email is required"));
      if ((user?.password || "") === "" && !externalLogin)
         errors.push(new ErrorDto("passwordHash", "Password is required"));
      if ((user.password || "") !== confirmPassword && !externalLogin)
         errors.push(new ErrorDto("passwordHash", "Passwords must match."));
      if (!termsAndCondition)
         errors.push(new ErrorDto("0", "You must agree to terms and conditions"));
      if (errors.length > 0)
         errorAlert.set(new AlertObj(errors, AlertTypes.Error));
      else {

         errorAlert.PleaseWait(500, isUnmounted);
         useCreateCustomerUser(user).then(result => {
            if (isUnmounted.current) return;
            setRedirectToMain(true);
            errorAlert.clear();
         }).catch(alert => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
         });
      };
   };

   const getRegistrationType = () => {
      let regType = user.registrationMethod?.type;
      if (regType != null && regType != RegistrationTypes.Application) {
         externalLogin = true;
         return `(${RegistrationTypesList.find(i => i.Value == regType)?.Name} account)`;
      }
      return "*";
   };

   if (redirectToMain) return <Redirect to="/" />;


   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="New Customer" />
         <div className="row">
            <Input label="Name *" className="col-6" key="name"
               value={user.firstName}
               showDanger={errorAlert.checkExist("firstname")}
               onChange={i => setUser({ ...user, firstName: i.target.value })}
            />

            <Input label="Surname *" className="col-6" key="surname"
               showDanger={errorAlert.checkExist("surname")}
               value={user.surname}
               onChange={i => setUser({ ...user, surname: i.target.value })}
            />
            <Input label="Phone Number" className="col-6" key="phoneNumber"
               value={user.phoneNumber}
               showDanger={errorAlert.checkExist("phoneNumber")}
               validationPattern={CommonRegex.UkNumber}
               onChange={i => setUser({ ...user, phoneNumber: i.target.value })}
            />

            <Input label={`Email ${getRegistrationType()}`} className="col-6" key="email1"
               showDanger={errorAlert.checkExist("email")}
               showValid={externalLogin}
               value={user.email}
               disabled={externalLogin}
               validationPattern={CommonRegex.Email}
               onChange={i => setUser({ ...user, email: i.target.value })}
            />
            {!externalLogin &&
               <>
                  <Input label={"Password*"}
                     type="password"
                     value={user.password}
                     className="col-6" key="password"
                     showDanger={errorAlert.checkExist("passwordhash")}
                     onChange={i => setUser({ ...user, password: i.target.value })}
                  />

                  <Input label={"Confirm Password*"}
                     type="password"
                     value={confirmPassword}
                     className="col-6" key="confirmPassword"
                     showDanger={errorAlert.checkExist("passwordhash")}
                     onChange={i => setConfirmPassword(i.target.value)}
                  />
               </>
            }
            <div className="col-12">
               <CheckBox key="tAndc" className="mt-1 color-style"
                  onChange={checked => setTermsAndCondition(checked)}
                  label={<>
                     I Agree to <a className="hover-gray text-underline" onClick={() => { history.push("/termsandconditions"); }} target="_blank" > terms and conditions</a>.*
                     </>}
               />
            </div>
            <div className="col-12 mt-2">
               <Alert alert={errorAlert.alert} className="col-12 mb-1"
                  onClosed={() => errorAlert.clear()}
               />
               <Button children="Submit" className="btn-lg col-12 col-sm-6 mt-2 btn-green"
                  onClick={() => createNewCustomer()} />
               <Button children="Cancel" className="btn-lg col-12 col-sm-6 mt-2 btn-white"
                  onClick={() => { errorAlert.clear(); props.onCancel(); }} />
            </div>
         </div>
      </Modal >
   );
};

type IProps = {
   isOpen: boolean,
   newUser?: User,
   onCancel: () => void;
   modalRef?: any;
};

export default NewCustomerModal;
