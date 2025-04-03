import React, { useState } from 'react';
import { Button, Modal, Form, Input, Spin, message, DatePicker, InputNumber } from 'antd';
import { createFundingRecord } from '../services/api';
import moment from 'moment';
import { columnDefinitions } from '../../../shared/config/column.config';

const CreateRecordModal = ({ visible, onClose, onRecordUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Use imported column definitions with types
  const columns = columnDefinitions;

  // Format value based on column type
  const formatValue = (value, type) => {
    if (!value && value !== 0) return value;
    
    switch (type) {
      case "YEAR":
        // Handle dayjs object from Ant Design DatePicker
        if (value.$d) {
          return moment(value.$d).format("YYYY");
        }
        // Handle moment object
        if (moment.isMoment(value)) {
          return value.format("YYYY");
        }
        // Handle string dates
        return moment(value).format("YYYY");
        
      case "DATE":
        // Handle dayjs object from Ant Design DatePicker
        if (value.$d) {
          return moment(value.$d).format("MMMM DD, YYYY");
        }
        // Handle moment object
        if (moment.isMoment(value)) {
          return value.format("MMMM DD, YYYY");
        }
        // Handle string dates
        return moment(value).format("MMMM DD, YYYY");
        
      case "PERCENTAGE":
        return `${value}%`; // Add % sign
        
      case "CURRENCY":
        return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`; // Format as $X,XXX,XXX
        
      default:
        return value;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const formattedValues = {};
      
      // Process each field and format based on type
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Find column type by name
          const column = columns.find(col => col.name === key);
          if (column) {
            const formattedValue = formatValue(value, column.type);
            formattedValues[key] = formattedValue;
          } else {
            formattedValues[key] = value;
          }
        }
      });
      
      await createFundingRecord(formattedValues);
      message.success('Record created successfully');
      form.resetFields(); // Clear the form
      onRecordUpdate(); // Refresh the data in parent component
      onClose();
    } catch (error) {
      console.error('Error creating record:', error);
      message.error('Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  const renderFormItems = () => {
    // Render form items for all possible columns based on their types
    return columns.map(column => (
      <Form.Item
        key={column.name}
        label={column.name}
        name={column.name}
        getValueFromEvent={
          column.type === "DATE" || column.type === "YEAR" 
            ? (date) => date // Return the date object directly, don't convert to string
            : undefined // Use default behavior for other fields
        }
      >
        {column.type === "STRING" && <Input />}
        {column.type === "DATE" && <DatePicker style={{ width: '100%' }} format="MMMM DD, YYYY" />}
        {column.type === "YEAR" && <DatePicker.YearPicker style={{ width: '100%' }} format="YYYY" />}
        {column.type === "PERCENTAGE" && (
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
          />
        )}
        {column.type === "NUMBER" && <InputNumber style={{ width: '100%' }} />}
        {column.type === "CURRENCY" && (
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => value ? `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        )}
      </Form.Item>
    ));
  };

  return (
    <Modal
      open={visible}
      title="Create New Funding Record"
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" shape='round' onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" shape='round' type="primary" onClick={handleSubmit} loading={loading}>
          Create Record
        </Button>,
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

export default CreateRecordModal;
