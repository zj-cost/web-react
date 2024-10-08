import { ContractImportApi } from "@/apis/projectApi";
import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Button } from "antd";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { ProjectContext } from "../detailContext";

type IAddOtherModalRef = {
  show: (e: any) => void;
};
type IAddOtherModalProps = {
  onSuccess: () => void;
};
const AddOtherModal = forwardRef<IAddOtherModalRef, IAddOtherModalProps>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { projectId, projectInfo } = useContext(ProjectContext);
    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setVisible(true);
        },
      }),
      [],
    );
    return (
      <ModalForm
        open={visible}
        onOpenChange={(e) => {
          if (!e) {
            setVisible(false);
          }
        }}
        title="新增其它费用"
        trigger={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={projectInfo?.confirmStatus === 1}
          >
            新增其它费用
          </Button>
        }
        onFinish={async (values) => {
          try {
            await ContractImportApi.addOther({ ...values, projectId });
            onSuccess();
            return true;
          } catch (error) {
            return false;
          }
        }}
        submitTimeout={2000}
      >
        <ProFormGroup>
          <ProFormText
            name="priceName"
            label="项目名称"
            width="md"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText
            fieldProps={{ type: "number" }}
            name="amount"
            label="金额"
            width="md"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormSelect
            name="unitProjectUuid"
            label="单位工程"
            width="md"
            rules={[
              {
                required: true,
              },
            ]}
            request={async () => {
              const res = await ContractImportApi.getProjectTypeList({
                id: projectId,
                type: 1,
              });
              const opts = res.data.map((v) => ({
                label: v.unitProject,
                value: v.uuid,
              }));
              return opts;
            }}
          />
          <ProFormDigit name="sort" label="排序" width="md" />
        </ProFormGroup>
      </ModalForm>
    );
  },
);

export default AddOtherModal;
