import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableView } from 'osnack-frontend-shared/src/components/Table/Table';
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
import { Redirect, useHistory } from 'react-router-dom';
import { checkUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';

const UserManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
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
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
      onSearch(...checkUri(window.location.pathname,
         [tblSelectedPage, tblMaxItemsPerPage, selectedRoleFilter, tblIsSortAsc, tblSortName, GetAllRecords]));
      return () => { isUnmounted.current = true; };
   }, []);


   const onSearch = (
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      roleFilter = selectedRoleFilter,
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      searchString = GetAllRecords
   ) => {

      if (searchValue != null && searchValue != "")
         searchString = searchValue;
      if (searchString != GetAllRecords)
         setSearchValue(searchString);
      if (isSortAsc != tblIsSortAsc)
         setTblIsSortAsc(isSortAsc);

      if (sortName != tblSortName)
         setTblsortName(sortName);

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (maxItemsPerPage != tblMaxItemsPerPage)
         setTblMaxItemsPerPage(maxItemsPerPage);

      if (Number(roleFilter) == -1)
         roleFilter = GetAllRecords;
      if (roleFilter != selectedRoleFilter)
         setselectedRoleFilter(roleFilter);

      history.push(generateUri(window.location.pathname,
         [selectedPage || tblSelectedPage,
            maxItemsPerPage, roleFilter == GetAllRecords ? -1 : roleFilter,
         Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));


      errorAlert.PleaseWait(500, isUnmounted);
      useGetUser(selectedPage, maxItemsPerPage, searchString, roleFilter, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            setTblTotalItemCount(result.data.totalCount || 0);
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
      errorAlert.clear();

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
      return <Redirect to={{ pathname: `/ViewUserOrders/${selectedUser.id}`, state: { backUrl: window.location.pathname } }} />;
   return (
      <Container className="container-fluid" >
         <PageHeader title="Users" className="line-header" />
         <div className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new category button  ****/}
            <div className="row col-12 pm-0">

               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-md-9  pr-md-4"
                  onSearch={() => { onSearch(1); }}
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
                     onClick={() => { onSearch(1, undefined, GetAllRecords); }} >
                     All
                  </button>
                  {roleList.map(role =>
                     <button className="dropdown-item" key={role.id}
                        onClick={() => { onSearch(1, undefined, role.id?.toString()); }} >
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
            {tblTotalItemCount > 0 &&
               <div className="row col-12 pm-0">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tblSortName}
                     data={tableData}
                     onSortChange={(isSortAsce, sortName) => onSearch(undefined, undefined, undefined, isSortAsce, sortName)}
                     view={TableView.CardView}
                     listCount={tblTotalItemCount} />
                  <Pagination
                     maxItemsPerPage={tblMaxItemsPerPage}
                     selectedPage={tblSelectedPage}
                     onChange={(selectedPage, maxItemsPerPage) => { onSearch(selectedPage, maxItemsPerPage); }}
                     listCount={tblTotalItemCount} />
               </div>
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
