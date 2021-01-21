import React, { useEffect, useState } from 'react';
import { enGB } from 'date-fns/locale';
import { DatePickerCalendar } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';
import Modal from '../Modals/Modal';
import { Button } from '../Buttons/Button';
import { Input } from './Input';
import { useDetectOutsideClick } from '../../hooks/function/useDetectOutsideClick';

export const DatePicker = (props: IProps) => {
   const [id] = useState(props.id ?? Math.random().toString());
   const [value, setValue] = useState(new Date());
   const [inputValue, setInputValue] = useState("");
   const [DateModal] = useState(React.createRef<HTMLDivElement>());
   const [isOpenDateModal, setIsOpenDateModal] = useDetectOutsideClick([DateModal], false);
   useEffect(() => {
      setValue(props.selectDate || new Date());
      setInputValue(new Date(props.selectDate!).ToShortDate());
   }, [props.selectDate]);


   const ConvertDate = (date: string) => {
      const dateMatch = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (dateMatch)
         return new Date(Number(dateMatch[3]), Number(dateMatch[2]) - 1, Number(dateMatch[1]));
      else
         return value;
   };

   return (
      <div className={`${props.className}`}>
         <div className="row m-0 p-0">
            <Input type="text"
               label={props.label}
               onChange={(i) => { setInputValue(i.target.value); }}
               inputRightLable={props.inputRightLable}
               value={inputValue}
               className="col m-0 p-0"
               onBlur={(i) => { setInputValue(new Date(ConvertDate(i.target.value)).ToShortDate()); setValue(ConvertDate(i.target.value)); props.onChange(ConvertDate(i.target.value)); }}
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
            <div className="row">
               <Button className="btn-sm ml-auto mr-auto" children="Set today" onClick={() => {
                  setValue(new Date());
                  setInputValue(new Date().ToShortDate());
               }} />
            </div>
            <DatePickerCalendar locale={enGB} key={id}
               minimumDate={props.minimumDate}
               maximumDate={props.maximumDate}
               date={new Date(value!)}
               onDateChange={(date) => {
                  setIsOpenDateModal(false);
                  setValue(date || new Date());
                  setInputValue(new Date(date!).ToShortDate());
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
