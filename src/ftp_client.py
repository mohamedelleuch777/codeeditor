ftp_proxy = FtpProxy(host='bluecoat.media-saturn.com', port=21)
ftp_client = ftp_proxy.connect('176.236.32.209', port=21, login='foobar')

assert ftp_client.ping() is True
files, directories = ftp_client.ls()
assert files and directories

files2, directories = ftp_client.ls(recursive=True)
assert len(files2) > len(files)

files3, directories = ftp_client.ls(recursive=True, extension='.txt')
assert not directories
assert files3[0].endswith('.txt')

fp = ftp_client.download(path='/foo.txt')
with open('/tmp/foo.txt', 'wb') as ff:
    ff.write(fp.read())
assert fp.tell() > 0