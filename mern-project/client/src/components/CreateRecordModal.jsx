import React, { useState } from 'react';
import { Button, Modal, Form, Input, Spin, message, DatePicker, InputNumber } from 'antd';
import { createFundingRecord } from '../services/api';

const CreateRecordModal = ({ visible, onClose, onRecordUpdate }) => {
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
    { name: "Zip", type: "STRING" },
    { name: "# Founders", type: "NUMBER" },
    { name: "Founded", type: "DATE" },
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
    { name: "CFRGR (Compound Funding Round Growth Rate)", type: "NUMBER" },
    { name: "CAFR", type: "CURRENCY" },
    { name: "Latest Valuation", type: "CURRENCY" },
    { name: "Latest Valuation Year", type: "DATE" },
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Filter out empty fields to keep database clean
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      );
      
      await createFundingRecord(filteredValues);
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
      <Form.Item key={column.name} label={column.name} name={column.name}>
        {column.type === "STRING" && <Input />}
        {column.type === "DATE" && <DatePicker style={{ width: '100%' }} />}
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
