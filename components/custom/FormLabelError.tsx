import { Typography } from "./Typography";

const FormLabelError = ({ error }: { error: string }) => {
  return (
    <Typography variant="small" color="destructive">
      {error}
    </Typography>
  );
};

export default FormLabelError;
