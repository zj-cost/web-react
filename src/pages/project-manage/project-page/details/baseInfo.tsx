import ProjectApi from "@/apis/projectApi";
import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { message } from "antd";
import { useContext, useEffect, useRef } from "react";
import { ProjectContext } from "./detailContext";

const BaseInfo = () => {
  const formRef = useRef<ProFormInstance>();
  const { projectInfo, projectId, getProjectInfo } = useContext(ProjectContext);
  useEffect(() => {
    if (projectInfo) {
      formRef.current?.setFieldsValue({
        ...projectInfo,
        // engineerList: info.engineerList?.map((e) => e.userId) ?? [],
        // expertList: info.expertList?.map((e) => e.userId) ?? [],
      });
    }
  }, [projectInfo]);

  return (
    <div>
      <ProForm
        formRef={formRef}
        disabled={projectInfo?.confirmStatus === 1}
        onFinish={async (val) => {
          try {
            await ProjectApi.update({ ...val, id: projectId });
            getProjectInfo();
            message.success("保存成功");
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="projectName"
            label="项目名称"
            placeholder="请输入项目名称"
            rules={[{ required: true }]}
          />

          <ProFormText
            width="md"
            name="contractName"
            label="合同名称"
            placeholder="请输入合同名称"
          />

          <ProFormText
            width="md"
            name="contractNumber"
            label="合同编码"
            placeholder="请输入合同编码"
          />

          <ProFormDigit
            width="md"
            name="contractAmount"
            label="合同金额(含税)"
            placeholder="请输入合同金额"
            fieldProps={{
              suffix: "万元",
            }}
          />

          <ProFormDigit
            width="md"
            name="projectDuration"
            label="项目工期"
            placeholder="请输入项目工期"
          />
          <ProFormText
            width="md"
            name="projectLocation"
            label="项目地点"
            placeholder="请输入项目地点"
          />
          <ProFormText
            width="md"
            name="constructionUnit"
            label="建设单位"
            placeholder="请输入建设单位"
          />
          <ProFormDigit
            width="md"
            name="vatRate"
            label="增值税税率"
            placeholder="请输入增值税税率"
            fieldProps={{
              suffix: "%",
            }}
          />
          <ProFormDatePicker
            width="md"
            name="contractStartDate"
            label="合同开工时间"
          />
          <ProFormDatePicker
            width="md"
            name="contractEndDate"
            label="合同竣工时间"
          />
          <ProFormDigit
            width="md"
            name="retrenchBudgetRatio"
            label="集团节约预算比例"
            fieldProps={{
              suffix: "%",
            }}
          />
          <ProFormSelect
            width="md"
            name="projectRegion"
            label="项目区域"
            options={["上海", "江苏", "苏州", "浙江"]}
            rules={[{ required: true }]}
          />
        </ProForm.Group>
        {/* <ProFormList label="算量工程师" name="d">
          <Input />
        </ProFormList> */}
      </ProForm>
    </div>
  );
};

export default BaseInfo;
