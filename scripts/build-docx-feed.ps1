# Converte Markdown em .docx com a identidade visual da Feed (preto/laranja, Barlow).
# Sem dependencias externas (OOXML + zip nativo). Remove emojis (regra da marca).
# Uso: powershell -File build-docx-feed.ps1 -mdPath "in.md" -docxPath "out.docx"
param(
  [Parameter(Mandatory=$true)][string]$mdPath,
  [Parameter(Mandatory=$true)][string]$docxPath
)
$ErrorActionPreference = 'Stop'

$ORANGE='FFA300'; $BLACK='070707'; $GRAY='53565A'; $WHITE='F4F5F0'; $DARK='1A1A1A'
$lines = Get-Content -LiteralPath $mdPath -Encoding UTF8

function StripEmoji([string]$s){
  if([string]::IsNullOrEmpty($s)){return $s}
  $s = $s.Replace([string][char]0x25B6, 'play')
  $sb = New-Object System.Text.StringBuilder
  for($k=0;$k -lt $s.Length;$k++){
    $ch = $s[$k]
    if([System.Char]::IsHighSurrogate($ch)){ $k++; continue }
    $code = [int][char]$ch
    if($code -eq 0xFE0F){ continue }
    if($code -ge 0x2600 -and $code -le 0x27BF){ continue }
    if($code -ge 0x2B00 -and $code -le 0x2BFF){ continue }
    if($code -ge 0x25A0 -and $code -le 0x25FF){ continue }
    [void]$sb.Append($ch)
  }
  $out = $sb.ToString() -replace ' {2,}',' '
  return $out.Trim()
}

function XmlEsc([string]$s){
  if($null -eq $s){return ''}
  $s = $s -replace '&','&amp;'; $s = $s -replace '<','&lt;'; $s = $s -replace '>','&gt;'
  return $s
}

function InlineRuns([string]$text,[bool]$baseBold=$false,[bool]$baseItalic=$false,[string]$color=''){
  $sb = New-Object System.Text.StringBuilder
  $bold=$baseBold; $ital=$baseItalic; $i=0
  $buf = New-Object System.Text.StringBuilder
  function Flush($buf,$bold,$ital,$color,$sb){
    if($buf.Length -eq 0){return}
    $rpr=''
    if($bold -or $ital -or $color){
      $rpr='<w:rPr>'
      if($bold){$rpr+='<w:b/>'}
      if($ital){$rpr+='<w:i/>'}
      if($color){$rpr+='<w:color w:val="'+$color+'"/>'}
      $rpr+='</w:rPr>'
    }
    [void]$sb.Append('<w:r>'+$rpr+'<w:t xml:space="preserve">'+(XmlEsc $buf.ToString())+'</w:t></w:r>')
    [void]$buf.Clear()
  }
  while($i -lt $text.Length){
    if($i+1 -lt $text.Length -and $text[$i] -eq '*' -and $text[$i+1] -eq '*'){ Flush $buf $bold $ital $color $sb; $bold = -not $bold; $i+=2; continue }
    if($text[$i] -eq '*'){ Flush $buf $bold $ital $color $sb; $ital = -not $ital; $i+=1; continue }
    [void]$buf.Append($text[$i]); $i++
  }
  Flush $buf $bold $ital $color $sb
  return $sb.ToString()
}

function Para([string]$runsXml,[string]$pprXml=''){ return '<w:p>'+$pprXml+$runsXml+'</w:p>' }

$body = New-Object System.Text.StringBuilder
$idx = 0
$titleDone = $false

while($idx -lt $lines.Count){
  $t = (StripEmoji ($lines[$idx].Trim()))
  $t = $t -replace '`',''

  if($t -eq ''){ [void]$body.Append((Para (InlineRuns ''))); $idx++; continue }

  # Titulo (primeiro #) -> banner preto com FEED
  if($t.StartsWith('# ') -and -not $titleDone){
    $title = $t.Substring(2)
    $cellMar = '<w:tcMar><w:top w:w="220" w:type="dxa"/><w:left w:w="240" w:type="dxa"/><w:bottom w:w="220" w:type="dxa"/><w:right w:w="240" w:type="dxa"/></w:tcMar>'
    $feedRun = '<w:r><w:rPr><w:b/><w:color w:val="'+$WHITE+'"/><w:sz w:val="48"/></w:rPr><w:t xml:space="preserve">FEED</w:t></w:r>'+
               '<w:r><w:rPr><w:b/><w:color w:val="'+$ORANGE+'"/><w:sz w:val="48"/></w:rPr><w:t xml:space="preserve"> /</w:t></w:r>'
    $titleRun = '<w:r><w:rPr><w:color w:val="'+$WHITE+'"/><w:sz w:val="26"/></w:rPr><w:t xml:space="preserve">'+(XmlEsc $title)+'</w:t></w:r>'
    $banner = '<w:tbl><w:tblPr><w:tblW w:type="pct" w:w="5000"/><w:tblBorders></w:tblBorders><w:tblCellMar></w:tblCellMar></w:tblPr>'+
              '<w:tr><w:tc><w:tcPr><w:tcW w:type="pct" w:w="5000"/><w:shd w:val="clear" w:color="auto" w:fill="'+$BLACK+'"/>'+$cellMar+'</w:tcPr>'+
              (Para $feedRun '<w:pPr><w:spacing w:after="40"/></w:pPr>')+
              (Para $titleRun)+
              '</w:tc></w:tr></w:tbl>'
    [void]$body.Append($banner)
    # barra laranja
    $obar = '<w:pPr><w:pBdr><w:bottom w:val="single" w:sz="18" w:space="1" w:color="'+$ORANGE+'"/></w:pBdr><w:spacing w:after="160"/></w:pPr>'
    [void]$body.Append((Para (InlineRuns '') $obar))
    $titleDone = $true; $idx++; continue
  }

  if($t -eq '---'){
    [void]$body.Append((Para (InlineRuns '') '<w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="CCCCCC"/></w:pBdr><w:spacing w:after="120"/></w:pPr>')); $idx++; continue
  }

  # ## -> titulo de secao com acento laranja embaixo
  if($t.StartsWith('## ')){
    $txt = $t.Substring(3)
    $ppr = '<w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="2" w:color="'+$ORANGE+'"/></w:pBdr><w:spacing w:before="240" w:after="100"/></w:pPr>'
    $runs = '<w:r><w:rPr><w:b/><w:color w:val="'+$BLACK+'"/><w:sz w:val="28"/></w:rPr><w:t xml:space="preserve">'+(XmlEsc $txt)+'</w:t></w:r>'
    [void]$body.Append((Para $runs $ppr)); $idx++; continue
  }
  # ### -> laranja
  if($t.StartsWith('### ')){
    $txt = $t.Substring(4)
    $ppr = '<w:pPr><w:spacing w:before="160" w:after="60"/></w:pPr>'
    $runs = '<w:r><w:rPr><w:b/><w:color w:val="'+$ORANGE+'"/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">'+(XmlEsc $txt)+'</w:t></w:r>'
    [void]$body.Append((Para $runs $ppr)); $idx++; continue
  }

  # > -> card cinza com texto branco
  if($t.StartsWith('> ')){
    $txt = $t.Substring(2)
    $cellMar = '<w:tcMar><w:top w:w="120" w:type="dxa"/><w:left w:w="200" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:right w:w="200" w:type="dxa"/></w:tcMar>'
    $card = '<w:tbl><w:tblPr><w:tblW w:type="pct" w:w="5000"/></w:tblPr>'+
            '<w:tr><w:tc><w:tcPr><w:tcW w:type="pct" w:w="5000"/><w:shd w:val="clear" w:color="auto" w:fill="'+$GRAY+'"/>'+$cellMar+'</w:tcPr>'+
            (Para (InlineRuns $txt $false $false $WHITE))+
            '</w:tc></w:tr></w:tbl>'
    [void]$body.Append($card)
    [void]$body.Append((Para (InlineRuns '') '<w:pPr><w:spacing w:after="80"/></w:pPr>'))
    $idx++; continue
  }

  # bullets - / * -> bullet laranja
  if($t.StartsWith('- ') -or $t.StartsWith('* ')){
    $txt = $t.Substring(2)
    $ppr = '<w:pPr><w:ind w:left="500" w:hanging="240"/><w:spacing w:after="40"/></w:pPr>'
    $bullet = '<w:r><w:rPr><w:b/><w:color w:val="'+$ORANGE+'"/></w:rPr><w:t xml:space="preserve">&#8226;  </w:t></w:r>'
    [void]$body.Append((Para ($bullet + (InlineRuns $txt)) $ppr)); $idx++; continue
  }

  # texto normal
  [void]$body.Append((Para (InlineRuns $t) '<w:pPr><w:spacing w:after="120"/></w:pPr>')); $idx++
}

# rodape da marca
$fbar = '<w:pPr><w:pBdr><w:top w:val="single" w:sz="6" w:space="1" w:color="CCCCCC"/></w:pBdr><w:spacing w:before="160"/></w:pPr>'
[void]$body.Append((Para (InlineRuns '') $fbar))
$footRun = '<w:r><w:rPr><w:color w:val="'+$GRAY+'"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">Feed / solucoes de IA para empresas</w:t></w:r>'
[void]$body.Append((Para $footRun '<w:pPr><w:jc w:val="center"/><w:spacing w:before="120"/></w:pPr>'))

$documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+$body.ToString()+
'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>'

$stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'+
'<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Barlow" w:hAnsi="Barlow" w:cs="Barlow"/><w:color w:val="'+$DARK+'"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="pt-BR"/></w:rPr></w:rPrDefault></w:docDefaults>'+
'<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>'+
'</w:styles>'

$contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'+
'<Default Extension="xml" ContentType="application/xml"/>'+
'<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'+
'<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'+
'</Types>'

$rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'

$docRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if(Test-Path -LiteralPath $docxPath){ Remove-Item -LiteralPath $docxPath -Force }
$enc = New-Object System.Text.UTF8Encoding($false)
$fs = [System.IO.File]::Open($docxPath,[System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($fs,[System.IO.Compression.ZipArchiveMode]::Create)
function AddEntry($zip,$name,$content,$enc){
  $entry = $zip.CreateEntry($name,[System.IO.Compression.CompressionLevel]::Optimal)
  $s = $entry.Open(); $bytes = $enc.GetBytes($content); $s.Write($bytes,0,$bytes.Length); $s.Close()
}
AddEntry $zip '[Content_Types].xml' $contentTypes $enc
AddEntry $zip '_rels/.rels' $rels $enc
AddEntry $zip 'word/document.xml' $documentXml $enc
AddEntry $zip 'word/styles.xml' $stylesXml $enc
AddEntry $zip 'word/_rels/document.xml.rels' $docRels $enc
$zip.Dispose(); $fs.Close()
"OK -> $docxPath ($([math]::Round((Get-Item -LiteralPath $docxPath).Length/1kb,1)) KB)"
