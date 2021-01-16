import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import ButtonCard from 'osnack-frontend-shared/src/components/Buttons/ButtonCard';
import { useHistory } from 'react-router-dom';
import { useSalesStatisticsDashboard, useSummaryDashboard } from '../../SecretHooks/useDashboardHook';
import { SalesPeriod, SalesPeriodList } from 'osnack-frontend-shared/src/_core/apiModels';
import InputDropdown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
const Dashboard = (props: IProps) => {
   const history = useHistory();
   const [totalSales, setTotalSales] = useState(0);
   const [totalNewOrders, setTotalNewOrders] = useState(0);
   const [totalOpenDisputes, setTotalOpenDispute] = useState(0);
   const [totalNewMessages, setTotalNewMessages] = useState(0);
   const [selectedPeriodSales, setSelectedPeriodSales] = useState(SalesPeriod.Daily);
   const [selectedPeriodOrders, setSelectedPeriodOrders] = useState(SalesPeriod.Daily);

   useEffect(() => {
      setSalesData();
      setOrdersData();
      useSummaryDashboard()
         .then(result => {
            setTotalSales(result.data.totalSales!);
            setTotalNewOrders(result.data.newOrderCount!);
            setTotalOpenDispute(result.data.openDisputeCount!);
            setTotalNewMessages(result.data.openMessageCount!);
         })
         .catch(errors => { });
   }, []);
   useEffect(() => {
      setSalesData();
   }, [selectedPeriodSales]);
   useEffect(() => {
      setOrdersData();
   }, [selectedPeriodOrders]);
   const setSalesData = () => {
      useSalesStatisticsDashboard(selectedPeriodSales)
         .then(result => {
            setTotalSalesChart(result.data.lableList!, result.data.priceList!);
         })
         .catch(errors => { });

   };
   const setOrdersData = () => {
      useSalesStatisticsDashboard(selectedPeriodOrders)
         .then(result => {
            setTotalOrdersChart(result.data.lableList!, result.data.countList!);
         })
         .catch(errors => { });

   };
   const setTotalOrdersChart = (lables: string[], data: number[]) => {
      //@ts-ignore
      var myChart = new Chart(document.getElementById('total-orders'), {
         type: 'line',
         data: {
            labels: lables,
            datasets: [{
               label: 'Orders',
               data: data,
               backgroundColor: [
                  'rgba(10, 74, 21, 1)',
               ],
               borderColor: [
                  'rgba(66, 245, 99, 0.2)',
               ],
               borderWidth: 1
            }]
         },
         options: {
            legend: {
               display: false,
               position: 'left',
            },
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero: true,
                  }
               }],
            }
         }
      });
   };
   const setTotalSalesChart = (lables: string[], data: number[]) => {
      //@ts-ignore
      var myChart = new Chart(document.getElementById('total-sales'), {
         type: 'line',
         data: {
            labels: lables,
            datasets: [{
               label: 'Sales',
               data: data,
               backgroundColor: [
                  'rgba(66, 245, 99, 0.2)',
               ],
               borderColor: [
                  'rgba(10, 74, 21, 1)',
               ],
               borderWidth: 1
            }]
         },
         options: {
            legend: {
               display: false,
               position: 'left',
            },
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero: true,
                     callback: function (value: any, index: any, values: any) {
                        return '£' + value;
                     }
                  }
               }]
            }
         }
      });
   };
   return (
      <Container className="container-fluid ">
         <PageHeader title="Dashboard" className="line-header" />
         <div className="row justify-content-center">
            <ButtonCard className="col-12 col-md-6 col-lg cursor-normal" cardClassName="d-flex align-items-center w-100  cursor-normal zig-zag-bg ">
               <div className="col-12 text-center font-weight-bold text-white">
                  Total Sales £{totalSales}
               </div>
            </ButtonCard>
            <ButtonCard className="col-12 col-md-6 col-lg" cardClassName="d-flex align-items-center w-100 large-triangles-bg"
               onClick={() => history.push("Orders/1/10/0/-1/0/Date/")}>
               <div className="col-12 text-center font-weight-bold text-white">
                  New Orders ({totalNewOrders})
               </div>
            </ButtonCard>
            <ButtonCard className="col-12 col-md-6 col-lg" cardClassName="d-flex align-items-center w-100 repeating-chevrons-bg"
               onClick={() => history.push("Orders/1/10/-1/True/0/Date/")}>
               <div className="col-12 text-center font-weight-bold">
                  Open Disputes ({totalOpenDisputes})
               </div>
            </ButtonCard>
            <ButtonCard className="col-12 col-md-6 col-lg" cardClassName="d-flex align-items-center w-100 alternating-arrowhead-bg"
               onClick={() => history.push("Messages/1/10/True/1/Date/")}>
               <div className="col-12 text-center font-weight-bold">
                  New Messages ({totalNewMessages})
               </div>
            </ButtonCard>
         </div>
         <div className="row justify-content-center">
            <div className="col-12 col-lg-6 ">
               <div className="row col-12 mx-0 py-4 my-2 bg-white shadow ">
                  <div className="col-12 my-0 mb-n5 text-center h4 font-weight-bold">Total Sales</div>
                  <InputDropdown dropdownTitle={`${SalesPeriodList.find(s => s.Value === selectedPeriodSales)?.Name}`}
                     className="col-auto m-0 ml-auto pb-0"
                     titleClassName={`btn`}>
                     {SalesPeriodList.map((option, index) =>
                        <button key={index} className={`dropdown-item `}
                           onClick={() => { setSelectedPeriodSales(option.Value); }}>
                           {option.Name}
                        </button>
                     )}
                  </InputDropdown>
                  <canvas id="total-sales" className="col my-3" />
               </div>
            </div>
            <div className="col-12 col-lg-6">
               <div className="row col-12 mx-0 py-4 my-2 bg-white shadow">
                  <div className="col-12 my-0 mb-n5 text-center h4 font-weight-bold">Total Orders</div>
                  <InputDropdown dropdownTitle={`${SalesPeriodList.find(s => s.Value === selectedPeriodOrders)?.Name}`}
                     className="col-auto m-0 ml-auto pb-0"
                     titleClassName={`btn`}>
                     {SalesPeriodList.map((option, index) =>
                        <button key={index} className={`dropdown-item `}
                           onClick={() => { setSelectedPeriodOrders(option.Value); }}>
                           {option.Name}
                        </button>
                     )}
                  </InputDropdown>
                  <canvas id="total-orders" className="col my-3" />
               </div>
            </div>
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default Dashboard;
