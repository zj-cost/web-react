import { ContractImportApi } from "@/apis/projectApi";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../detailContext";

type IImportBtnProps = {
  onSuccess: VoidFunction;
  unitProjectUuid?: string;
};
const ImportBtn = ({ onSuccess, unitProjectUuid }: IImportBtnProps) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);

  const [channel, setChannel] = useState(1);

  useEffect(() => {
    if (unitProjectUuid) {
      ContractImportApi.getProjectTypeDetails({ unitProjectUuid }).then(
        (res) => {
          setChannel(res.data.channel);
        },
      );
    }
  }, [unitProjectUuid]);

  const customRequest = (fileList: any) => {
    const data = new FormData();
    data.append("file", fileList.file);
    data.append("id", projectId);

    setLoading(true);
    ContractImportApi.import(data)
      .then((res) => {
        message.success("导入成功");
        onSuccess();
        fileList.onSuccess({ ...res.data });
      })
      .catch((err) => {
        fileList.onError(err, fileList);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (channel === 2) return null;
  return (
    <Upload multiple customRequest={customRequest} showUploadList={false}>
      <Button type="primary" loading={loading} icon={<UploadOutlined />}>
        导入标底文件
      </Button>
    </Upload>
  );
};

export default ImportBtn;
