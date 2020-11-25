import React, { useEffect, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableHeaderData, TableRowData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Role, User } from 'osnack-frontend-shared/src/_core/apiModels';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, AlertTypes, Error } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useSearchUser } from '../../hooks/apiCallers/user/Get.User';
import UserModal from './UserModal';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import { useGetAllRoles } from '../../hooks/apiCallers/role/Get.Role';
import { sleep } from 'osnack-frontend-shared/src/_core/appFunc';

const UserManagement = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectedUser, setSelectedUser] = useState(new User());
   const [selectedRoleFilter, setselectedRoleFilter] = useState(GetAllRecords);
   const [isOpenUserModal, setIsOpenUserModal] = useState(false);
   const [roleList, setRoleList] = useState<Role[]>([]);

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("FirstName");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useGetAllRoles().then(result => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setRoleList(result.roleList);
            setAlert(alert.Clear);
         }
      });
      onSearch();
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


      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useSearchUser(selectedPage, maxItemsPerPage, searchString, roleFilter, isSortAsc, sortName).then(result => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         }
         else {
            setTblTotalItemCount(result.totalCount);
            populateUserTable(result.userList);
            setAlert(alert.Clear);
         }
      });
   };

   const populateUserTable = (userList: User[]) => {
      let tData = new TableData();
      tData.headers.push(new TableHeaderData("Name", "FirstName", true));
      tData.headers.push(new TableHeaderData("Surname", "Surname", true));
      tData.headers.push(new TableHeaderData("Email", "Email", true));
      tData.headers.push(new TableHeaderData("Role", "Role.Name", true));
      tData.headers.push(new TableHeaderData("", "", false));

      userList.map(user =>
         tData.rows.push(new TableRowData([
            user.firstName,
            user.surname,
            user.email,
            user.role?.name,
            <div className="col-auto p-0 m-0">
               <button className="btn btn-sm btn-blue col-12 m-0 mt-1 mt-xl-0"
                  onClick={() => { editUser(user); }}
                  children="Edit" />
            </div>
         ])));
      if (userList.length == 0) {
         setAlert(new AlertObj([new Error("0", "No Result Found")], AlertTypes.Warning));
      } else {
         setAlert(alert.Clear);
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

   return (
      <Container className="container-fluid pr-0">
         <PageHeader title="Users" className="line-header-lg" />
         <div className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new category button  ****/}
            <div className="row col-12 m-0 p-0">

               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-md-9 m-0 p-0"
                  onSearch={() => { onSearch(tblIsSortAsc, tblSortName); }}
               />

               <Button children={<span className="add-icon" children="User" />}
                  className="col-12 col-md-3 mt-1 mt-md-0 btn-green btn-lg"
                  onClick={() => { setIsOpenUserModal(true); }}
               />
            </div>
            <div className="row col-12 p-0 m-0 pt-3 ">

               <DropDown title={`Role: ${roleList.find((r) => r.id.toString() == selectedRoleFilter)?.name || "All"}`}
                  className="col-12 col-sm-6 col-md-4 ml-auto m-0 p-1"
                  titleClassName="btn btn-white filter-icon">
                  <div className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, GetAllRecords); }} >
                     All
                  </div>
                  {roleList.map(role =>
                     <div className="dropdown-item" key={role.id}
                        onClick={() => { onSearch(undefined, undefined, undefined, undefined, role.id.toString()); }} >
                        {role.name}
                     </div>
                  )}
               </DropDown>

               <Alert alert={alert}
                  className="col-12 mb-2"
                  onClosed={() => { setAlert(alert.Clear); }}
               />
            </div>

            {/***** Category Table  ****/}
            <div className="row col-12 p-0 m-0">
               <Table className="col-12 text-center table-striped mt-4"
                  defaultSortName={tblSortName}
                  data={tableData}
                  onSortClick={onSearch}
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
