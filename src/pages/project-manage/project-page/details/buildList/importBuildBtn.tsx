import BuildApi from "@/apis/buildApi";
import { UploadOutlined } from "@ant-design/icons";
import { ProFormSelect } from "@ant-design/pro-components";
import { Button, Form, Modal, Upload, message } from "antd";
import { useContext, useState } from "react";
import { ProjectContext } from "../detailContext";
//导入构件计算书
type IImportBuildBtnProps = {
  onSuccess: VoidFunction;
};
const ImportBuildBtn = ({ onSuccess }: IImportBuildBtnProps) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [uuid, setUuid] = useState<string>();
  const customRequest = (fileList: any) => {
    if (!uuid) return message.error("请选择单位工程");
    const data = new FormData();
    data.append("file", fileList.file);
    data.append("id", projectId);
    data.append("uuid", uuid);
    setLoading(true);
    BuildApi.import(data)
      .then((res) => {
        message.success("导入成功");
        onSuccess();
        setVisible(false);
        fileList.onSuccess({ ...res.data });
      })
      .catch((err) => {
        fileList.onError(err, fileList);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Button
        onClick={() => {
          setVisible(true);
        }}
        type="primary"
      >
        导入构件计算书
      </Button>
      <Modal
        title="导入构件计算书"
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        destroyOnClose
        footer={false}
        centered
      >
        <ProFormSelect
          width={"md"}
          label="单位工程"
          request={async () => {
            const res = await BuildApi.getBuildProject({ id: projectId });
            return res.data.map((e) => ({
              label: e.unitProject,
              value: e.uuid,
            }));
          }}
          onChange={(v: string) => {
            setUuid(v);
          }}
          placeholder={"请选择单位工程"}
        />
        <Form.Item label="构件计算书">
          <Upload
            multiple
            customRequest={customRequest}
            showUploadList={false}
            disabled={!uuid}
          >
            <Button
              type="primary"
              disabled={!uuid}
              loading={loading}
              icon={<UploadOutlined />}
            >
              导入构件计算书
            </Button>
          </Upload>
        </Form.Item>
      </Modal>
    </>
  );
};

export default ImportBuildBtn;
