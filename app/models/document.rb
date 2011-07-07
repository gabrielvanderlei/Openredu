class Document < ActiveRecord::Base
  has_ipaper_and_uses 'Paperclip'
  has_attached_file :attachment, Redu::Application.config.paperclip_documents
  validates_attachment_content_type :attachment,
    :content_type => Redu::Application.config.mimetypes['documents']

  has_one :lecture, :as => :lectureable

  # Verifica se o curso tem espaço suficiente para o arquivo
  def can_upload_document?(lecture)
    return false if lecture.subject.space.course.plan.state != "active"
    plan = lecture.subject.space.course.plan
    quota = lecture.subject.space.course.quota

    if quota.files > plan.file_storage_limit
      return false
    else
      return true
    end
  end

  def need_uploading?
    !(self.conversion_processing? or self.conversion_complete?)
  end

  def display_ipaper(options = {})
    id = options.delete(:id)
      <<-END
        <div id="embedded_flash#{id}">#{options.delete(:alt)}</div>
        <script type="text/javascript">
          var scribd_doc = scribd.Document.getDoc(#{ipaper_id}, '#{ipaper_access_key}');
          #{js_params(options)}
          scribd_doc.write("embedded_flash#{id}");
        </script>
      END
  end

end
