# Converte um arquivo Markdown em .docx valido (OOXML), sem dependencias externas.
# Uso: powershell -File md-to-docx.ps1 -mdPath "caminho\arquivo.md" -docxPath "caminho\saida.docx"
param(
  [Parameter(Mandatory=$true)][string]$mdPath,
  [Parameter(Mandatory=$true)][string]$docxPath
)
$ErrorActionPreference = 'Stop'
$lines = Get-Content -LiteralPath $mdPath -Encoding UTF8

function XmlEsc([string]$s){
  if($null -eq $s){return ''}
  $s = $s -replace '&','&amp;'
  $s = $s -replace '<','&lt;'
  $s = $s -replace '>','&gt;'
  return $s
}

function InlineRuns([string]$text,[bool]$baseBold=$false,[bool]$baseItalic=$false){
  $sb = New-Object System.Text.StringBuilder
  $bold = $baseBold; $ital = $baseItalic
  $i = 0
  $buf = New-Object System.Text.StringBuilder
  function Flush($buf,$bold,$ital,$sb){
    if($buf.Length -eq 0){return}
    $rpr = ''
    if($bold -or $ital){
      $rpr = '<w:rPr>'
      if($bold){$rpr += '<w:b/>'}
      if($ital){$rpr += '<w:i/>'}
      $rpr += '</w:rPr>'
    }
    [void]$sb.Append('<w:r>'+$rpr+'<w:t xml:space="preserve">'+(XmlEsc $buf.ToString())+'</w:t></w:r>')
    [void]$buf.Clear()
  }
  while($i -lt $text.Length){
    if($i+1 -lt $text.Length -and $text[$i] -eq '*' -and $text[$i+1] -eq '*'){
      Flush $buf $bold $ital $sb
      $bold = -not $bold; $i += 2; continue
    }
    if($text[$i] -eq '*'){
      Flush $buf $bold $ital $sb
      $ital = -not $ital; $i += 1; continue
    }
    if($i+1 -lt $text.Length -and $text[$i] -eq '`' ){
      [void]$buf.Append($text[$i]); $i++; continue
    }
    [void]$buf.Append($text[$i]); $i++
  }
  Flush $buf $bold $ital $sb
  return $sb.ToString()
}

function Para([string]$runsXml,[string]$pprXml=''){
  return '<w:p>'+$pprXml+$runsXml+'</w:p>'
}

$body = New-Object System.Text.StringBuilder
$idx = 0
function IsTableRow([string]$l){ return ($l.Trim().StartsWith('|') -and $l.Trim().EndsWith('|')) }
function IsSep([string]$l){ return ($l -match '^\s*\|?[\s:\-\|]+\|?\s*$' -and $l -match '-') }

while($idx -lt $lines.Count){
  $raw = $lines[$idx]
  $line = $raw.TrimEnd()
  $t = $line.Trim()
  # remove crase de codigo inline pra ficar limpo no Word
  $t = $t -replace '`',''

  if($t -eq ''){ [void]$body.Append((Para (InlineRuns ''))); $idx++; continue }

  if($t -eq '---'){
    $ppr = '<w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="999999"/></w:pBdr><w:spacing w:after="120"/></w:pPr>'
    [void]$body.Append((Para (InlineRuns '') $ppr)); $idx++; continue
  }

  if((IsTableRow $line) -and ($idx+1 -lt $lines.Count) -and (IsSep $lines[$idx+1])){
    $rows = @()
    $rows += $line
    $j = $idx+2
    while($j -lt $lines.Count -and (IsTableRow $lines[$j])){ $rows += $lines[$j].TrimEnd(); $j++ }
    $tbl = '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:type="auto" w:w="0"/><w:tblBorders>'+
           '<w:top w:val="single" w:sz="4" w:space="0" w:color="999999"/>'+
           '<w:left w:val="single" w:sz="4" w:space="0" w:color="999999"/>'+
           '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="999999"/>'+
           '<w:right w:val="single" w:sz="4" w:space="0" w:color="999999"/>'+
           '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="999999"/>'+
           '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="999999"/>'+
           '</w:tblBorders></w:tblPr>'
    $rowNum = 0
    foreach($r in $rows){
      $cells = ($r.Trim().Trim('|')) -split '\|'
      $isHeader = ($rowNum -eq 0)
      $tbl += '<w:tr>'
      foreach($c in $cells){
        $cellText = ($c.Trim() -replace '`','')
        $parts = $cellText -split '<br>'
        $cellRuns = ''
        $first = $true
        foreach($p in $parts){
          if(-not $first){ $cellRuns += '<w:r><w:br/></w:r>' }
          $cellRuns += (InlineRuns $p $isHeader $false)
          $first = $false
        }
        $shd = if($isHeader){'<w:shd w:val="clear" w:color="auto" w:fill="EDEDED"/>'}else{''}
        $tbl += '<w:tc><w:tcPr>'+$shd+'</w:tcPr><w:p>'+$cellRuns+'</w:p></w:tc>'
      }
      $tbl += '</w:tr>'
      $rowNum++
    }
    $tbl += '</w:tbl>'
    [void]$body.Append($tbl)
    [void]$body.Append((Para (InlineRuns '')))
    $idx = $j; continue
  }

  if($t.StartsWith('### ')){
    $txt = $t.Substring(4)
    $ppr = '<w:pPr><w:spacing w:before="160" w:after="60"/></w:pPr>'
    [void]$body.Append((Para (InlineRuns $txt $true $false) $ppr)); $idx++; continue
  }
  if($t.StartsWith('## ')){
    $txt = $t.Substring(3)
    $ppr = '<w:pPr><w:spacing w:before="240" w:after="80"/></w:pPr>'
    $runs = '<w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t xml:space="preserve">'+(XmlEsc $txt)+'</w:t></w:r>'
    [void]$body.Append((Para $runs $ppr)); $idx++; continue
  }
  if($t.StartsWith('# ')){
    $txt = $t.Substring(2)
    $ppr = '<w:pPr><w:jc w:val="center"/><w:spacing w:after="200"/></w:pPr>'
    $runs = '<w:r><w:rPr><w:b/><w:sz w:val="34"/></w:rPr><w:t xml:space="preserve">'+(XmlEsc $txt)+'</w:t></w:r>'
    [void]$body.Append((Para $runs $ppr)); $idx++; continue
  }

  if($t.StartsWith('> ')){
    $txt = $t.Substring(2)
    $ppr = '<w:pPr><w:ind w:left="360"/><w:spacing w:after="80"/></w:pPr>'
    [void]$body.Append((Para (InlineRuns $txt $false $true) $ppr)); $idx++; continue
  }

  if($t.StartsWith('- ') -or $t.StartsWith('* ')){
    $txt = $t.Substring(2)
    $ppr = '<w:pPr><w:ind w:left="600" w:hanging="240"/><w:spacing w:after="40"/></w:pPr>'
    $bullet = '<w:r><w:t xml:space="preserve">&#8226;  </w:t></w:r>'
    [void]$body.Append((Para ($bullet + (InlineRuns $txt)) $ppr)); $idx++; continue
  }

  $ppr = '<w:pPr><w:spacing w:after="120"/></w:pPr>'
  [void]$body.Append((Para (InlineRuns $t) $ppr)); $idx++
}

$documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
'<w:body>' + $body.ToString() +
'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>' +
'</w:body></w:document>'

$stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
'<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="pt-BR"/></w:rPr></w:rPrDefault></w:docDefaults>' +
'<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>' +
'<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tblBorders></w:tblPr></w:style>' +
'</w:styles>'

$contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
'<Default Extension="xml" ContentType="application/xml"/>' +
'<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
'<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
'</Types>'

$rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
'</Relationships>'

$docRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
'</Relationships>'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if(Test-Path -LiteralPath $docxPath){ Remove-Item -LiteralPath $docxPath -Force }
$enc = New-Object System.Text.UTF8Encoding($false)
$fs = [System.IO.File]::Open($docxPath,[System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($fs,[System.IO.Compression.ZipArchiveMode]::Create)
function AddEntry($zip,$name,$content,$enc){
  $entry = $zip.CreateEntry($name,[System.IO.Compression.CompressionLevel]::Optimal)
  $s = $entry.Open()
  $bytes = $enc.GetBytes($content)
  $s.Write($bytes,0,$bytes.Length)
  $s.Close()
}
AddEntry $zip '[Content_Types].xml' $contentTypes $enc
AddEntry $zip '_rels/.rels' $rels $enc
AddEntry $zip 'word/document.xml' $documentXml $enc
AddEntry $zip 'word/styles.xml' $stylesXml $enc
AddEntry $zip 'word/_rels/document.xml.rels' $docRels $enc
$zip.Dispose()
$fs.Close()
"OK -> $docxPath ($([math]::Round((Get-Item -LiteralPath $docxPath).Length/1kb,1)) KB)"
