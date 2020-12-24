import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableHeaderData, TableRowData, TableView } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { Role, User } from 'osnack-frontend-shared/src/_core/apiModels';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useGetUser } from '../../SecretHooks/useUserHook';
import UserModal from './UserModal';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import { useGetRole } from '../../SecretHooks/useRoleHook';
import { Redirect } from 'react-router-dom';

const UserManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectedUser, setSelectedUser] = useState(new User());
   const [selectedRoleFilter, setselectedRoleFilter] = useState(GetAllRecords);
   const [isOpenUserModal, setIsOpenUserModal] = useState(false);
   const [redirectToOrders, setRedirectToOrders] = useState(false);
   const [roleList, setRoleList] = useState<Role[]>([]);

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("FirstName");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      errorAlert.PleaseWait(500, isUnmounted);
      useGetRole().then(result => {
         if (isUnmounted.current) return;
         setRoleList(result.data);
         errorAlert.clear();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

      onSearch();
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = (
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      roleFilter = selectedRoleFilter
   ) => {
      let searchString = GetAllRecords;

      if (searchValue != null && searchValue != "")
         searchString = searchValue;

      if (isSortAsc != tblIsSortAsc)
         setTblIsSortAsc(isSortAsc);

      if (sortName != tblSortName)
         setTblsortName(sortName);

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (maxItemsPerPage != tblMaxItemsPerPage)
         setTblMaxItemsPerPage(maxItemsPerPage);
      if (roleFilter != selectedRoleFilter)
         setselectedRoleFilter(roleFilter);


      errorAlert.PleaseWait(500, isUnmounted);
      useGetUser(selectedPage, maxItemsPerPage, searchString, roleFilter, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            setTblTotalItemCount(result.data.totalCount || 0);
            populateUserTable(result.data.userList!);
            errorAlert.clear();
         }
      ).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

   };

   const populateUserTable = (userList: User[]) => {
      let tData = new TableData();
      tData.headers.push(new TableHeaderData("Name", "FirstName", true));
      tData.headers.push(new TableHeaderData("Surname", "Surname", true));
      tData.headers.push(new TableHeaderData("Email", "Email", true));
      tData.headers.push(new TableHeaderData("Role", "Role.Name", false));
      tData.headers.push(new TableHeaderData("", "", false));

      userList.map(user =>
         tData.rows.push(new TableRowData([
            user.firstName,
            user.surname,
            user.email,
            user.role?.name,
            <>
               {user.hasOrder &&
                  <TableRowButtons
                     btnClassName="btn-white cart-icon"
                     btnChildren={user.orderLength}
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
         ])));
      if (userList.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
      } else {
         errorAlert.clear();
      }
      setTableData(tData);
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
   if (redirectToOrders == true)
      return <Redirect to={{ pathname: `/ViewUserOrders/${selectedUser.id}` }} />;
   return (
      <Container >
         <PageHeader title="Users" className="line-header-lg" />
         <div className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new category button  ****/}
            <div className="row col-12 pm-0">

               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-md-9 "
                  onSearch={() => { onSearch(tblIsSortAsc, tblSortName); }}
               />

               <Button children={<span className="add-icon" children="User" />}
                  className="col-12 col-md-3 mt-1 mt-md-0 btn-green btn"
                  onClick={() => { setIsOpenUserModal(true); }}
               />
            </div>
            <div className="row col-12 pm-0 pt-3 ">

               <DropDown title={`Role: ${roleList.find((r) => r.id?.toString() == selectedRoleFilter)?.name || "All"}`}
                  className="col-12 col-md-4 ml-auto pm-0"
                  titleClassName="btn btn-white filter-icon ">
                  <button className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, GetAllRecords); }} >
                     All
                  </button>
                  {roleList.map(role =>
                     <button className="dropdown-item" key={role.id}
                        onClick={() => { onSearch(undefined, undefined, undefined, undefined, role.id?.toString()); }} >
                        {role.name}
                     </button>
                  )}
               </DropDown>

               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => { errorAlert.clear(); }}
               />
            </div>

            {/***** Users Table  ****/}
            <div className="row col-12 pm-0">

               <Table className="col-12 text-center table-striped"
                  defaultSortName={tblSortName}
                  data={tableData}
                  onSortClick={onSearch}
                  view={TableView.CardView}
                  listCount={tblTotalItemCount}
               />
               <Pagination
                  maxItemsPerPage={tblMaxItemsPerPage}
                  selectedPage={tblSelectedPage}
                  onChange={(selectedPage, maxItemsPerPage) => { onSearch(tblIsSortAsc, tblSortName, selectedPage, maxItemsPerPage); }}
                  listCount={tblTotalItemCount} />
            </div>

            {/***** Add/ modify User modal  ****/}
            <UserModal isOpen={isOpenUserModal} roleList={roleList}
               onSuccess={() => { resetUserModal(); onSearch(tblIsSortAsc, tblSortName); }}
               user={selectedUser}
               onClose={resetUserModal} />
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default UserManagement;
