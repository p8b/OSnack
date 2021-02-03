import React, { useState, useEffect, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { RegistrationTypes, RegistrationTypesList, User } from "osnack-frontend-shared/src/_core/apiModels";
import { CommonRegex } from "osnack-frontend-shared/src/_core/appConst";
import PageHeader from "osnack-frontend-shared/src/components/Texts/PageHeader";
import { Input } from "osnack-frontend-shared/src/components/Inputs/Input";
import { CheckBox } from "osnack-frontend-shared/src/components/Inputs/CheckBox";
import { useCreateCustomerUser } from "osnack-frontend-shared/src/hooks/PublicHooks/useUserHook";
import Modal from "osnack-frontend-shared/src/components/Modals/Modal";
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from "osnack-frontend-shared/src/components/Texts/Alert";
import ModalFooter from "osnack-frontend-shared/src/components/Modals/ModalFooter";

const NewCustomerModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [user, setUser] = useState(new User());
   const [termsAndCondition, setTermsAndCondition] = useState(false);
   const [subscribeNewsLetter, setSubscribeNewsLetter] = useState(false);
   const [confirmPassword, setConfirmPassword] = useState("");
   const [redirectToMain, setRedirectToMain] = useState(false);
   const history = useHistory();
   let externalLogin = false;

   useEffect(() => () => { isUnmounted.current = true; }, []);
   useEffect(() => {
      if (props.newUser !== undefined) setUser(props.newUser);
      setTermsAndCondition(false);
   }, [props.newUser]);

   const createNewCustomer = (loadingCallBack?: () => void) => {
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
      if (errors.length > 0) {
         errorAlert.set(new AlertObj(errors, AlertTypes.Error));
         loadingCallBack!();
      }
      else {
         errorAlert.pleaseWait(isUnmounted);
         useCreateCustomerUser(user, subscribeNewsLetter).then(result => {
            if (isUnmounted.current) return;
            setRedirectToMain(true);
            errorAlert.clear();
            loadingCallBack!();
         }).catch(errors => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
            loadingCallBack!();
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
      <Modal className="col-12 col-sm-11 col-md-9 col-lg-6"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="New Customer" />
         <div className="row">
            <Input label="Name *"
               className="col-12 col-sm-6"
               value={user.firstName}
               showDanger={errorAlert.checkExist("firstname")}
               onChange={i => setUser({ ...user, firstName: i.target.value })}
            />

            <Input label="Surname *"
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExist("surname")}
               value={user.surname}
               onChange={i => setUser({ ...user, surname: i.target.value })}
            />
            <Input label="Phone Number"
               className="col-12 col-sm-6"
               value={user.phoneNumber}
               showDanger={errorAlert.checkExist("phoneNumber")}
               validationPattern={CommonRegex.UkNumber}
               onChange={i => setUser({ ...user, phoneNumber: i.target.value })}
            />

            <Input label={`Email ${getRegistrationType()}`}
               className="col-12 col-sm-6"
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
                     className="col-12 col-sm-6"
                     type="password"
                     value={user.password}
                     showDanger={errorAlert.checkExist("passwordhash")}
                     onChange={i => setUser({ ...user, password: i.target.value })}
                  />

                  <Input label={"Confirm Password*"}
                     className="col-12 col-sm-6"
                     type="password"
                     value={confirmPassword}
                     showDanger={errorAlert.checkExist("passwordhash")}
                     onChange={i => setConfirmPassword(i.target.value)}
                  />
               </>
            }
            <div className="row col-12">
               <CheckBox
                  className="col-12 m-0 mt-1"
                  inputClassName="color-style-checked"
                  onChange={checked => setSubscribeNewsLetter(checked)}
                  label="Subscribe to our news letter to receive latest promotions"
               />
               <CheckBox
                  className="col-12 m-0 mt-1"
                  inputClassName="color-style-checked"
                  onChange={checked => setTermsAndCondition(checked)}
                  label={<>
                     I Agree to <a className="hover-gray text-underline" onClick={() => { history.push("/termsandconditions"); }} target="_blank" > terms and conditions</a>.*
                     </>}
               />
            </div>
         </div>
         <Alert alert={errorAlert.alert} className="col-12 mb-1"
            onClosed={() => errorAlert.clear()}
         />
         <ModalFooter
            createText="Submit"
            onCreate={createNewCustomer}
            enableLoadingCreate={isUnmounted}
            onCancel={() => { errorAlert.clear(); props.onCancel(); }}

         />
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
