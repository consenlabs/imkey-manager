; connector.dll 是 32 位 MSVC 构建，依赖 VCRUNTIME140.dll（VC++ 2015-2022 x86 运行库）。
; 目标机器缺少该运行库时 LoadLibrary 返回 Win32 error 126，应用启动即报错，
; 因此安装时检测并静默安装随包附带的 vc_redist.x86.exe。

!if /FileExists "${PROJECT_DIR}/vc_redist.x86.exe"
!else
  !error "缺少 vc_redist.x86.exe：请从 https://aka.ms/vs/17/release/vc_redist.x86.exe 下载并放到项目根目录后再打包"
!endif

!macro customInstall
  ; x86 运行库注册在 32 位注册表视图下（64 位系统对应 WOW6432Node）
  SetRegView 32
  ReadRegDWORD $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x86" "Installed"
  SetRegView lastused
  ; 注册表仍在但文件已被删除时也重新安装。32 位安装器下 $SYSDIR 在 64 位系统会被重定向到 SysWOW64
  StrCpy $2 "1"
  ${IfNot} ${FileExists} "$SYSDIR\vcruntime140.dll"
    StrCpy $2 "0"
  ${EndIf}

  ${If} $0 != 1
  ${OrIf} $2 != 1
    DetailPrint "Installing Microsoft Visual C++ Redistributable (x86)..."
    InitPluginsDir
    File "/oname=$PLUGINSDIR\vc_redist.x86.exe" "${PROJECT_DIR}/vc_redist.x86.exe"
    ExecWait '"$PLUGINSDIR\vc_redist.x86.exe" /install /quiet /norestart' $1
    ; 0 成功，1638 已安装更新版本，3010 成功但需重启
    ${If} $1 != 0
    ${AndIf} $1 != 1638
    ${AndIf} $1 != 3010
      MessageBox MB_OK|MB_ICONEXCLAMATION "Microsoft Visual C++ 运行库安装失败（错误码 $1），imKey Manager 可能无法启动。$\r$\n请手动下载安装：https://aka.ms/vs/17/release/vc_redist.x86.exe$\r$\n$\r$\nFailed to install the Microsoft Visual C++ Redistributable (code $1). Please install it manually from the link above."
    ${EndIf}
  ${EndIf}
!macroend
