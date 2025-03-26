import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Spin, message } from 'antd';
import { updateFundingRecord, deleteFundingRecord } from '../services/api';

const EditorModel = ({ record, visible, onClose, onRecordUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Define all possible columns from FundingTable
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
  
  useEffect(() => {
    if (record && visible) {
      // Fill the form with record data
      form.setFieldsValue(record);
    }
  }, [record, visible, form]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Filter out empty fields to keep database clean
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      );
      
      await updateFundingRecord(record._id, filteredValues);
      message.success('Record updated successfully');
      onRecordUpdate(); // Refresh the data in parent component
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
      onRecordUpdate(); // Refresh the data in parent component
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
    
    // Render form items for all possible columns, not just those in the record
    return columns.map(column => (
      <Form.Item key={column} label={column} name={column}>
        <Input />
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
        <Button key="cancel" shape='round' onClick={onClose}>
          Cancel
        </Button>,
        <Button key="delete" shape='round' danger onClick={handleDelete} loading={loading}>
          Delete Record
        </Button>,
        <Button key="update" shape='round' type="primary" onClick={handleUpdate} loading={loading}>
          Update Record
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

export default EditorModel;