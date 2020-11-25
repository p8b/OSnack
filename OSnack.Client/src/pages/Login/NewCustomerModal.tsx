import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { User } from "osnack-frontend-shared/src/_core/apiModels";
import { RegistrationTypes, CommonRegex } from "osnack-frontend-shared/src/_core/constant.Variables";
import { enumToArray, sleep } from "osnack-frontend-shared/src/_core/appFunc";
import PageHeader from "osnack-frontend-shared/src/components/Texts/PageHeader";
import { Input } from "osnack-frontend-shared/src/components/Inputs/Input";
import { CheckBox } from "osnack-frontend-shared/src/components/Inputs/CheckBox";
import { Button } from "osnack-frontend-shared/src/components/Buttons/Button";
import { useCreateCustomer } from "../../hooks/apiCallers/user/Post.User";
import Modal from "osnack-frontend-shared/src/components/Modals/Modal";
import Alert, { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";

const NewCustomerModal = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [user, setUser] = useState(new User());
   const [termsAndCondition, setTermsAndCondition] = useState(false);
   const [confirmPassword, setConfirmPassword] = useState("");
   const [redirectToMain, setRedirectToMain] = useState(false);
   const history = useHistory();
   let externalLogin = false;

   const createNewCustomer = async () => {
      let errors = [];
      if ((user.firstName || "") === "")
         errors.push(new Error("firstName", "Name is required"));
      if ((user.surname || "") === "")
         errors.push(new Error("surname", "Surname is required"));
      if ((user.email || "") === "")
         errors.push(new Error("email", "Email is required"));
      if ((user?.Password || "") === "" && !externalLogin)
         errors.push(new Error("passwordHash", "Password is required"));
      if ((user.Password || "") !== confirmPassword && !externalLogin)
         errors.push(new Error("passwordHash", "Passwords must match."));
      if (!termsAndCondition)
         errors.push(new Error("0", "You must agree to terms and conditions"));
      if (errors.length > 0)
         setAlert(new AlertObj(errors, AlertTypes.Error));
      else {

         sleep(500).then(() => { setAlert(alert.PleaseWait); });
         useCreateCustomer(user).then(result => {
            if (result.List.length > 0)
               setAlert(result);
            else
               setRedirectToMain(true);
            setAlert(alert.Clear);
         });
      };
   };

   const getRegistrationType = () => {
      let regType = user.registrationMethod?.type;
      if (regType != null && regType != RegistrationTypes.Application) {
         let typeList = enumToArray(RegistrationTypes);
         externalLogin = true;
         return `(${typeList.find(i => i.id == regType)?.name} account)`;
      }
      return "*";
   };

   useEffect(() => {
      if (props.newUser !== null) setUser(props.newUser);
      setTermsAndCondition(false);
   }, [props.newUser]);

   if (redirectToMain) return <Redirect to="/" />;


   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="New Customer" />
         <div className="row">
            <Input label="Name *" className="col-6" key="name"
               value={user.firstName}
               showDanger={alert.checkExist("firstname")}
               onChange={i => setUser({ ...user, firstName: i.target.value })}
            />

            <Input label="Surname *" className="col-6" key="surname"
               showDanger={alert.checkExist("surname")}
               value={user.surname}
               onChange={i => setUser({ ...user, surname: i.target.value })}
            />
            <Input label="Phone Number" className="col-6" key="phoneNumber"
               value={user.phoneNumber}
               showDanger={alert.checkExist("phoneNumber")}
               validationPattern={CommonRegex.UkNumber}
               onChange={i => setUser({ ...user, phoneNumber: i.target.value })}
            />

            <Input label={`Email ${getRegistrationType()}`} className="col-6" key="email1"
               showDanger={alert.checkExist("email")}
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
                     value={user.Password}
                     className="col-6" key="password"
                     showDanger={alert.checkExist("passwordhash")}
                     onChange={i => setUser({ ...user, Password: i.target.value })}
                  />

                  <Input label={"Confirm Password*"}
                     type="password"
                     value={confirmPassword}
                     className="col-6" key="confirmPassword"
                     showDanger={alert.checkExist("passwordhash")}
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
               <Alert alert={alert} className="col-12 mb-1"
                  onClosed={() => setAlert(alert.Clear)}
               />
               <Button children="Submit" className="btn-lg col-12 col-sm-6 mt-2 btn-green"
                  onClick={() => createNewCustomer()} />
               <Button children="Cancel" className="btn-lg col-12 col-sm-6 mt-2 btn-white"
                  onClick={() => { setAlert(alert.Clear); props.onCancel(); }} />
            </div>
         </div>
      </Modal >
   );
};

type IProps = {
   isOpen: boolean,
   newUser: User,
   onCancel: () => void;
   modalRef?: any;
};

export default NewCustomerModal;