import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Spin, message, Popconfirm } from 'antd';
import { updateFundingRecord, deleteFundingRecord } from '../services/api';
import { columnNames } from '../../../shared/config/column.config';

const EditorModel = ({ record, visible, onClose, onRecordUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Use imported columns
  const columns = columnNames;
  
  useEffect(() => {
    if (record && visible) {
      form.resetFields();
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