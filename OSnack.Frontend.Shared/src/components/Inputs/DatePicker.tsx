import React, { useEffect, useState } from 'react';
import { enGB } from 'date-fns/locale';
import { DatePickerCalendar } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';
import Modal from '../Modals/Modal';
import { Button } from '../Buttons/Button';
import { Input } from './Input';
import { useDetectOutsideClick } from '../../hooks/function/useDetectOutsideClick';

export const DatePicker = (props: IProps) => {
   const id: string = props.id === undefined ? Math.random().toString() : props.id!;
   const [value, setValue] = useState(new Date());
   const [DateModal] = useState(React.createRef<HTMLDivElement>());
   const [isOpenDateModal, setIsOpenDateModal] = useDetectOutsideClick(DateModal, false);
   useEffect(() => {
      setValue(props.selectDate || new Date());
   }, [props.selectDate]);
   return (
      <div className={`${props.className}`}>
         <div className="row m-0 p-0">
            <Input type="text"
               label={props.label}
               inputRightLable={props.inputRightLable}
               value={new Date(value).ToShortDate()}
               className="col m-0 p-0"
               onChange={e => console.log(value)}
               disabled={props.disabled || false}
            />
            <div className="col-2 m-0 p-0 mt-auto mb-3">
               <Button className={`w-100 calendar-icon btn radius-none-l`}
                  onClick={() => setIsOpenDateModal(true)}
               />
            </div>
         </div>
         <Modal className="col-10 col-sm-8 col-md-6 col-lg-4 pl-4 pr-4"
            isOpen={isOpenDateModal}
            bodyRef={DateModal}>

            <DatePickerCalendar locale={enGB} key={id}
               minimumDate={props.minimumDate}
               maximumDate={props.maximumDate}
               date={new Date(value!)}
               onDateChange={(date) => {
                  setIsOpenDateModal(false);
                  setValue(date || new Date());
                  props.onChange(date);
               }} />
         </Modal>
      </div>
   );
};

interface IProps {
   id?: string;
   label?: string;
   selectDate?: Date;
   minimumDate?: Date;
   maximumDate?: Date;
   className?: string;
   disabled?: boolean;
   inputRightLable?: string;
   modalRef?: any;
   onChange: (date: Date | null) => void;
}
