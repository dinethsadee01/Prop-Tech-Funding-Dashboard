import React, { useState } from 'react';
import { Button, Modal, Form, Input, Spin, message } from 'antd';
import { createFundingRecord } from '../services/api';

const CreateRecordModal = ({ visible, onClose, onRecordUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Define all possible columns from FundingTable (same as in EditorModel)
  const columns = [
    "Name", "Technology", "Prop Type", "AngelList", "Crunchbase", "Domain", "HQ Address", "City", "State", "Zip",
    "# Founders", "Founded", "Years Active", "# of Funding Rounds", "Valuation Rank", "Funding/Year Rank",
    "Total Funding Rank", "ARR Rank", "CAFR Rank", "Avg. Funding/Year", "ARR/Funds Raised", "Total Funding",
    "Estimated ARR", "CFRGR (Compound Funding Round Growth Rate)", "CAFR", "Latest Valuation", "Latest Valuation Year",
    "Accelerator", "Accelerator 2", "Pre-Seed Date", "Pre-Seed $", "Seed Date", "Seed $", "Bridge Date", "Bridge $",
    "A Round Date", "A Round $", "B Round Date", "B Round $", "C Round Date", "C Round $", "D Round Date", "D Round $",
    "E Round Date", "E Round $", "F Round Date", "F Round $", "G Round Date", "G Round $", "H Round Date", "H Round $",
    "Unknown Series Date", "Unknown Series $", "Non-Dilutive Round Date", "Non-Dilutive Round $", "Exit Date", "Exit $",
    "Acquirer"
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
    // Render form items for all possible columns
    return columns.map(column => (
      <Form.Item key={column} label={column} name={column}>
        <Input />
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
