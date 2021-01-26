import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { Role, User } from 'osnack-frontend-shared/src/_core/apiModels';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useGetUser } from '../../SecretHooks/useUserHook';
import UserModal from './UserModal';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import { useGetRole } from '../../SecretHooks/useRoleHook';
import { Redirect, useHistory } from 'react-router-dom';
import { extractUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';

const UserManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("FirstName", true);
   const [searchValue, setSearchValue] = useState("");
   const [selectedUser, setSelectedUser] = useState(new User());
   const [selectedRoleFilter, setselectedRoleFilter] = useState(GetAllRecords);
   const [isOpenUserModal, setIsOpenUserModal] = useState(false);
   const [redirectToOrders, setRedirectToOrders] = useState(false);
   const [roleList, setRoleList] = useState<Role[]>([]);

   useEffect(() => {
      useGetRole().then(result => {
         if (isUnmounted.current) return;
         setRoleList(result.data);
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
      return () => { isUnmounted.current = true; };
   }, []);

   useEffect(() => {
      onSearch(...extractUri([
         tbl.selectedPage,
         tbl.maxItemsPerPage,
         tbl.isSortAsc,
         tbl.sortName,
         selectedRoleFilter,
         GetAllRecords]));
   }, [window.location.pathname]);

   const onSearch = (
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      isSortAsc = tbl.isSortAsc,
      sortName = tbl.sortName,
      roleFilter = selectedRoleFilter,
      searchString = GetAllRecords
   ) => {

      if (searchValue != null && searchValue != "")
         searchString = searchValue;
      if (searchString != GetAllRecords)
         setSearchValue(searchString);
      if (isSortAsc != tbl.isSortAsc)
         tbl.setIsSortAsc(isSortAsc);

      if (sortName != tbl.sortName)
         tbl.setSortName(sortName);

      if (selectedPage != tbl.selectedPage)
         tbl.setSelectedPage(selectedPage);

      if (maxItemsPerPage != tbl.maxItemsPerPage)
         tbl.setMaxItemsPerPage(maxItemsPerPage);

      if (Number(roleFilter) == -1)
         roleFilter = GetAllRecords;
      if (roleFilter != selectedRoleFilter)
         setselectedRoleFilter(roleFilter);

      const newUri = generateUri([
         selectedPage,
         maxItemsPerPage,
         Number(isSortAsc),
         sortName,
         roleFilter == GetAllRecords ? -1 : roleFilter,
         searchString != GetAllRecords ? searchValue : ""]);
      if (window.location.pathname.toLowerCase() != newUri.toLowerCase())
         history.push(newUri);

      errorAlert.pleaseWait(isUnmounted);
      useGetUser(selectedPage, maxItemsPerPage, searchString, roleFilter, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            tbl.setTotalItemCount(result.data.totalCount || 0);
            errorAlert.clear();
            populateUserTable(result.data.userList!);
         }
      ).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };
   const populateUserTable = (userList: User[]) => {
      if (userList.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      let tData = new TableData();
      tData.AddHeader("Name", "FirstName")
         .AddHeader("Surname", "Surname")
         .AddHeader("Email", "Email")
         .AddHeader("Role", "Role.Name");

      userList.map(user =>
         tData.AddRow([
            user.firstName,
            user.surname,
            user.email,
            user.role?.name,
            <>
               {user.hasOrder &&
                  <TableRowButtons
                     btnClassName="btn-white cart-icon"
                     btnChildren={user.orderLength == 0 ? "" : user.orderLength}
                     btnClick={() => { viewOrders(user); }}
                     btn1ClassName="btn-blue edit-icon"
                     btn1Click={() => { editUser(user); }}
                  />

               }
               {!user.hasOrder &&
                  <TableRowButtons
                     btnClassName="btn-blue edit-icon"
                     btnClick={() => { editUser(user); }}
                  />
               }
            </>
         ]));

      tbl.setData(tData);
   };
   const editUser = (user: User) => {
      setSelectedUser(user);
      setIsOpenUserModal(true);
   };
   const resetUserModal = () => {
      setIsOpenUserModal(false);
      setSelectedUser(new User());
   };

   const viewOrders = (user: User) => {
      setSelectedUser(user);
      setRedirectToOrders(true);
   };
   if (redirectToOrders)
      return <Redirect to={{ pathname: `/ViewUserOrders`, state: { userId: selectedUser.id, backUrl: window.location.pathname } }} />;
   return (
      <Container className="container-fluid" >
         <PageHeader title="Users" className="line-header" />
         <div className="row col-12 py-3 mx-auto bg-white">
            {/***** Search Input and new category button  ****/}

            <SearchInput
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9  pr-md-4"
               onSearch={() => { onSearch(1); }}
            />

            <Button children={<span className="add-icon" children="User" />}
               className="col-12 col-md-3 btn-green btn mt-2 mt-md-0"
               onClick={() => { setIsOpenUserModal(true); }}
            />

            <DropDown title={`Role: ${roleList.find((r) => r.id?.toString() == selectedRoleFilter)?.name || "All"}`}
               className="col-12 col-sm pm-0 mt-2"
               titleClassName="btn btn-white filter-icon ">
               <button className="dropdown-item"
                  onClick={() => { onSearch(1, undefined, undefined, undefined, GetAllRecords); }}
                  children="All"
               />
               {roleList.map(role =>
                  <button className="dropdown-item" key={role.id}
                     onClick={() => { onSearch(1, undefined, undefined, undefined, role.id?.toString()); }} >
                     {role.name}
                  </button>
               )}
            </DropDown>

            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />

            {/***** Users Table  ****/}
            {tbl.totalItemCount > 0 &&
               <Table tableData={tbl}
                  onChange={onSearch}
                  tblClassName="col-12 text-center table-striped"
               />
            }
            {/***** Add/ modify User modal  ****/}
            <UserModal isOpen={isOpenUserModal} roleList={roleList}
               onSuccess={() => { resetUserModal(); onSearch(); }}
               user={selectedUser}
               onClose={resetUserModal} />
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default UserManagement;
