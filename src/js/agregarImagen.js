import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
  dictDefaultMessage: 'Sube las imagenes aquí',
  acceptedFiles: '.jpg, .jpeg, .png,',
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: true,
  addRemoveLinks: true,
  dictRemoveFile: 'Eliminar imagen',
  dictMaxFilesExceeded: 'Solo se puede subir un archivo',
  headers: {
    'CSRF-Token': token
  },
  paramName: 'imagen'

}