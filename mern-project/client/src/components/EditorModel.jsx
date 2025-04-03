import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Spin, message, Popconfirm, DatePicker, InputNumber } from 'antd';
import { updateFundingRecord, deleteFundingRecord } from '../services/api';
import moment from 'moment';

const EditorModel = ({ record, visible, onClose, onRecordUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Define all possible columns from FundingTable with their types
  const columns = [
    { name: "Name", type: "STRING" },
    { name: "Technology", type: "STRING" },
    { name: "Prop Type", type: "STRING" },
    { name: "AngelList", type: "STRING" },
    { name: "Crunchbase", type: "STRING" },
    { name: "Domain", type: "STRING" },
    { name: "HQ Address", type: "STRING" },
    { name: "City", type: "STRING" },
    { name: "State", type: "STRING" },
    { name: "Zip", type: "NUMBER" },
    { name: "# Founders", type: "NUMBER" },
    { name: "Founded", type: "YEAR" },
    { name: "Years Active", type: "NUMBER" },
    { name: "# of Funding Rounds", type: "NUMBER" },
    { name: "Valuation Rank", type: "NUMBER" },
    { name: "Funding/Year Rank", type: "NUMBER" },
    { name: "Total Funding Rank", type: "NUMBER" },
    { name: "ARR Rank", type: "NUMBER" },
    { name: "CAFR Rank", type: "NUMBER" },
    { name: "Avg. Funding/Year", type: "CURRENCY" },
    { name: "ARR/Funds Raised", type: "CURRENCY" },
    { name: "Total Funding", type: "CURRENCY" },
    { name: "Estimated ARR", type: "CURRENCY" },
    { name: "CFRGR (Compound Funding Round Growth Rate)", type: "PERCENTAGE" },
    { name: "CAFR", type: "PERCENTAGE" },
    { name: "Latest Valuation", type: "CURRENCY" },
    { name: "Latest Valuation Year", type: "YEAR" },
    { name: "Accelerator", type: "STRING" },
    { name: "Accelerator 2", type: "STRING" },
    { name: "Pre-Seed Date", type: "DATE" },
    { name: "Pre-Seed $", type: "CURRENCY" },
    { name: "Seed Date", type: "DATE" },
    { name: "Seed $", type: "CURRENCY" },
    { name: "Bridge Date", type: "DATE" },
    { name: "Bridge $", type: "CURRENCY" },
    { name: "A Round Date", type: "DATE" },
    { name: "A Round $", type: "CURRENCY" },
    { name: "B Round Date", type: "DATE" },
    { name: "B Round $", type: "CURRENCY" },
    { name: "C Round Date", type: "DATE" },
    { name: "C Round $", type: "CURRENCY" },
    { name: "D Round Date", type: "DATE" },
    { name: "D Round $", type: "CURRENCY" },
    { name: "E Round Date", type: "DATE" },
    { name: "E Round $", type: "CURRENCY" },
    { name: "F Round Date", type: "DATE" },
    { name: "F Round $", type: "CURRENCY" },
    { name: "G Round Date", type: "DATE" },
    { name: "G Round $", type: "CURRENCY" },
    { name: "H Round Date", type: "DATE" },
    { name: "H Round $", type: "CURRENCY" },
    { name: "Unknown Series Date", type: "DATE" },
    { name: "Unknown Series $", type: "CURRENCY" },
    { name: "Non-Dilutive Round Date", type: "DATE" },
    { name: "Non-Dilutive Round $", type: "CURRENCY" },
    { name: "Exit Date", type: "DATE" },
    { name: "Exit $", type: "CURRENCY" },
    { name: "Acquirer", type: "STRING" }
  ];
  
  // Function to parse database values based on their expected type
  const parseValueForForm = (value, type) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    try {
      switch (type) {
        case "DATE":
          if (typeof value === 'string') {
            if (value.includes('N/A') || value.includes('#')) {
              return undefined;
            }
            const parsedDate = moment(value, [
              'MMMM DD, YYYY', 
              'MMM DD, YYYY', 
              'M/D/YYYY', 
              'MM/DD/YYYY',
              'YYYY-MM-DD'
            ], true);
            
            return parsedDate.isValid() ? parsedDate : undefined;
          }
          return undefined;
          
        case "YEAR":
          if (typeof value === 'string') {
            if (value.includes('N/A') || value.includes('#')) {
              return undefined;
            }
            const yearMatch = value.match(/\d{4}/);
            if (yearMatch) {
              return moment(yearMatch[0], 'YYYY');
            }
          }
          return undefined;
          
        case "NUMBER":
          if (typeof value === 'string') {
            if (value.includes('N/A') || value.includes('#')) {
              return undefined;
            }
            const num = Number(value.replace(/[^0-9.-]+/g, ''));
            return isNaN(num) ? undefined : num;
          } else if (typeof value === 'number') {
            return value;
          }
          return undefined;
          
        case "PERCENTAGE":
          if (typeof value === 'string') {
            if (value.includes('N/A') || value.includes('#')) {
              return undefined;
            }
            const cleaned = value.replace(/[^0-9.-]+/g, '');
            const num = Number(cleaned);
            return isNaN(num) ? undefined : num;
          } else if (typeof value === 'number') {
            return value;
          }
          return undefined;
          
        case "CURRENCY":
          if (typeof value === 'string') {
            if (value.includes('N/A') || value.includes('#')) {
              return undefined;
            }
            const cleaned = value.replace(/[^0-9.-]+/g, '');
            const num = Number(cleaned);
            return isNaN(num) ? undefined : num;
          } else if (typeof value === 'number') {
            return value;
          }
          return undefined;
          
        default:
          return value;
      }
    } catch (error) {
      console.error(`Error parsing value ${value} of type ${type}:`, error);
      return undefined;
    }
  };

  // Function to format values for submission to the database
  const formatValueForSubmission = (value, type) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    
    try {
      switch (type) {
        case "YEAR":
          if (value.$d) {
            return moment(value.$d).format("YYYY");
          }
          if (moment.isMoment(value)) {
            return value.format("YYYY");
          }
          if (typeof value === 'string') {
            return value;
          }
          return value;
          
        case "DATE":
          if (value.$d) {
            return moment(value.$d).format("MMMM DD, YYYY");
          }
          if (moment.isMoment(value)) {
            return value.format("MMMM DD, YYYY");
          }
          if (typeof value === 'string') {
            return value;
          }
          return value;
          
        case "PERCENTAGE":
          return `${value}%`;
          
        case "CURRENCY":
          if (typeof value === 'number') {
            return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
          }
          return value;
          
        default:
          return value;
      }
    } catch (error) {
      console.error(`Error formatting value ${value} of type ${type}:`, error);
      return value;
    }
  };
  
  useEffect(() => {
    if (record && visible) {
      form.resetFields();
      
      const formValues = {};
      columns.forEach(column => {
        const value = record[column.name];
        formValues[column.name] = parseValueForForm(value, column.type);
      });
      
      form.setFieldsValue(formValues);
    }
  }, [record, visible, form]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const formattedValues = {};
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const column = columns.find(col => col.name === key);
          if (column) {
            formattedValues[key] = formatValueForSubmission(value, column.type);
          } else {
            formattedValues[key] = value;
          }
        }
      });
      
      await updateFundingRecord(record._id, formattedValues);
      message.success('Record updated successfully');
      onRecordUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating record:', error);
      message.error('Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteFundingRecord(record._id);
      message.success('Record deleted successfully!');
      onRecordUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting record:', error);
      message.error('Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const renderFormItems = () => {
    if (!record) return null;
    
    return columns.map(column => (
      <Form.Item
        key={column.name}
        label={column.name}
        name={column.name}
        getValueFromEvent={
          column.type === "DATE" || column.type === "YEAR" 
            ? (date) => date
            : undefined
        }
      >
        {column.type === "STRING" && <Input />}
        {column.type === "DATE" && <DatePicker style={{ width: '100%' }} format="MMMM DD, YYYY" />}
        {column.type === "YEAR" && <DatePicker.YearPicker style={{ width: '100%' }} format="YYYY" />}
        {column.type === "PERCENTAGE" && (
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => value ? `${value}%` : ''}
            parser={value => value?.replace('%', '')}
          />
        )}
        {column.type === "NUMBER" && <InputNumber style={{ width: '100%' }} />}
        {column.type === "CURRENCY" && (
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => value ? `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
          />
        )}
      </Form.Item>
    ));
  };

  return (
    <Modal
      open={visible}
      title="Edit Funding Record"
      onCancel={onClose}
      width={800}
      footer={[
        <>
        <Button key="cancel" shape='round' onClick={onClose}>
          Cancel
        </Button>
        <Popconfirm
        title="Delete this record?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onOpenChange={() => {}}
      >
        <Button key="delete" shape='round' danger loading={loading}>
          Delete Record
        </Button>
      </Popconfirm>
        <Button key="update" shape='round' type="primary" onClick={handleUpdate} loading={loading}>
          Update Record
        </Button>
        </>
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form 
          form={form} 
          layout="vertical" 
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
        >
          {renderFormItems()}
        </Form>
      )}
    </Modal>
  );
};

export default EditorModel;