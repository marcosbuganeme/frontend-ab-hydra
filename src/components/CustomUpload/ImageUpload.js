import React from "react";
import axios from 'axios'
import PropTypes from "prop-types";
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from "components/CustomButtons/Button.js";

export default function ImageUpload(props) {
  const Api = axios.create({ baseURL: 'http://104.154.117.141:3501/' });

  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [filial] = React.useState(props.filial);
  const [url] = React.useState(props.url);
  const [maxHeight] = React.useState(props.maxHeight);
  const [maxWidth] = React.useState(props.maxWidth);
  const [isEdited, setIsEdited] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(props.avatar);

  let fileInput = React.createRef();

  const handleImageChange = async e => {
    e.preventDefault();
    setLoading(true);

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setLoading(false);
  };
  const handleClick = () => {
    setIsEdited(true);
    props.handleImageUpload(true);
    fileInput.current.click();
  };
  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    const config = { headers: { 'content-type': 'multipart/form-data' } };
    const reader = new FileReader();

    if (file !== null) {
      reader.readAsDataURL(file);
      reader.onload = async e => {
        setLoading(true);

        let image = new Image();
        image.src = e.target.result;
        image.onload = async () => {
          let height = image.height;
          let width = image.width;
          if (height > maxHeight || width > maxWidth) {
            alert(`Resolução máxima: ${maxHeight}x${maxWidth}`);
            return false;
          }
          await Api.post(`${url}?filial=${filial}`, formData, config).then(res => alert('Salvo com sucesso.'));
          setIsEdited(false);
          setFile(null);
          setLoading(false)
          return true;
        };
      }
    }

  };
  const handleCancel = e => {
    e.preventDefault();
    setImagePreviewUrl(props.avatar);
    setIsEdited(false);
    setFile(null);
    props.handleImageUpload(false);
  };

  let { addButtonProps, saveButtonProps, cancelButtonProps } = props;

  return (
    <div className="fileinput text-center">
      {loading ?
        (<CircularProgress
          style={{ float: 'left', position: 'relative', left: '50%' }}
          color="inherit"
          size={50} />) :
        (<div>
          <input type="file" onChange={handleImageChange} ref={fileInput} />

          <div className={"thumbnail" + (imagePreviewUrl ? " img-circle" : "")}>
            <img src={imagePreviewUrl} alt="..." />
          </div>

          <div>
            {file === null && !isEdited ?
              (<span>
                <Button {...addButtonProps} size="sm" onClick={() => handleClick()}>
                  Selecionar
                </Button>
              </span>) :
              (<span>
                <Button {...cancelButtonProps} size="sm" onClick={(e) => handleCancel(e)}>
                  Cancelar
                </Button>
                <Button {...saveButtonProps} size="sm" onClick={(e) => handleSubmit(e)}>
                  Salvar
                </Button>
              </span>)}
          </div>
        </div>)}
    </div>
  );
}

ImageUpload.propTypes = {
  avatar: PropTypes.any,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object
};
