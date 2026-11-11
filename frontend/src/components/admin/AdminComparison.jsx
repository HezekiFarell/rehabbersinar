import { useState, useMemo, useRef } from 'react'
import {
    Download, Upload, Users, TrendingUp, BarChart3,
    Award, Percent, FileSpreadsheet, Trash2, RefreshCw
} from 'lucide-react'
import * as XLSX from 'xlsx'

const MAX_SCORE = 15

const categorize = (g) => (g >= 0.7 ? 'Tinggi' : g >= 0.3 ? 'Sedang' : 'Rendah')

const computeStats = (rows) => {
    if (!rows?.length) return null
    const valid = rows.filter((r) => r.pretest != null && r.posttest != null)
    if (!valid.length) return null

    const pretests = valid.map((r) => Number(r.pretest))
    const posttests = valid.map((r) => Number(r.posttest))
    const gains = valid.map((r) => {
        const pre = Number(r.pretest)
        const post = Number(r.posttest)
        const denom = MAX_SCORE - pre
        if (denom <= 0) return 0                 // 15 → 15 = 0
        const g = (post - pre) / denom
        return g < 0 ? 0 : g                     // negatif dipaksa 0, sama seperti Excel
    })

    const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length
    const variance = (a) => {
        const m = mean(a)
        return a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length
    }

    const meanGain = mean(gains)
    const cats = gains.map(categorize)

    return {
        n: valid.length,
        meanPretest: mean(pretests),
        meanPosttest: mean(posttests),
        meanGain,
        sdGain: Math.sqrt(variance(gains)),
        minGain: Math.min(...gains),
        maxGain: Math.max(...gains),
        category: categorize(meanGain),
        distribution: {
            Tinggi: cats.filter((c) => c === 'Tinggi').length,
            Sedang: cats.filter((c) => c === 'Sedang').length,
            Rendah: cats.filter((c) => c === 'Rendah').length,
        },
        rows: valid.map((r, i) => ({
            no: i + 1,
            nama: r.nama || `Responden ${i + 1}`,
            pretest: Number(r.pretest),
            posttest: Number(r.posttest),
            gain: gains[i],
            kategori: cats[i],
        })),
    }
}

const parseFile = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const wb = XLSX.read(e.target.result, { type: 'array' })
                const ws = wb.Sheets[wb.SheetNames[0]]
                const json = XLSX.utils.sheet_to_json(ws, { defval: '' })
                const rows = json.map((r) => {
                    const keys = Object.keys(r).reduce((acc, k) => {
                        acc[k.toLowerCase().trim()] = r[k]
                        return acc
                    }, {})
                    return {
                        nama: keys.nama || keys.name || keys.responden || '',
                        pretest: Number(keys.pretest ?? keys.pre_test ?? keys.pre ?? 0),
                        posttest: Number(keys.posttest ?? keys.post_test ?? keys.post ?? 0),
                    }
                })
                resolve(rows)
            } catch (err) {
                reject(err)
            }
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })

const AdminComparison = () => {
    const [dataA, setDataA] = useState([])
    const [dataB, setDataB] = useState([])
    const [fileAName, setFileAName] = useState('')
    const [fileBName, setFileBName] = useState('')
    const inputARef = useRef(null)
    const inputBRef = useRef(null)

    const statsA = useMemo(() => computeStats(dataA), [dataA])
    const statsB = useMemo(() => computeStats(dataB), [dataB])

    const handleUpload = async (file, setData, setName) => {
        if (!file) return
        try {
            const rows = await parseFile(file)
            setData(rows)
            setName(file.name)
        } catch (e) {
            alert('Gagal membaca file: ' + e.message)
        }
    }

    const exportStats = (label, stats) => {
        if (!stats) return alert('Belum ada data untuk ' + label)
        const wb = XLSX.utils.book_new()

        const dataRows = stats.rows.map((r) => ({
            No: r.no,
            Nama: r.nama,
            Pretest: r.pretest,
            Posttest: r.posttest,
            'N-Gain': +r.gain.toFixed(4),
            Kategori: r.kategori,
        }))
        const ws1 = XLSX.utils.json_to_sheet(dataRows)
        ws1['!cols'] = [{ wch: 6 }, { wch: 25 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 }]
        XLSX.utils.book_append_sheet(wb, ws1, 'Data & N-Gain')

        const statsRows = [
            [`ANALISIS N-GAIN - ${label}`],
            [],
            ['Jumlah Responden', stats.n],
            ['Skor Maksimum', MAX_SCORE],
            [],
            ['STATISTIK DESKRIPTIF'],
            ['Rata-rata Pretest', +stats.meanPretest.toFixed(2)],
            ['Rata-rata Posttest', +stats.meanPosttest.toFixed(2)],
            ['Rata-rata N-Gain', +stats.meanGain.toFixed(4)],
            ['SD N-Gain', +stats.sdGain.toFixed(4)],
            ['N-Gain Minimum', +stats.minGain.toFixed(4)],
            ['N-Gain Maksimum', +stats.maxGain.toFixed(4)],
            ['Kategori N-Gain', stats.category],
            [],
            ['DISTRIBUSI KATEGORI N-GAIN'],
            ['Tinggi (g ≥ 0.7)', stats.distribution.Tinggi],
            ['Sedang (0.3 ≤ g < 0.7)', stats.distribution.Sedang],
            ['Rendah (g < 0.3)', stats.distribution.Rendah],
        ]
        const ws2 = XLSX.utils.aoa_to_sheet(statsRows)
        ws2['!cols'] = [{ wch: 30 }, { wch: 20 }]
        XLSX.utils.book_append_sheet(wb, ws2, 'Statistik')

        XLSX.writeFile(wb, `Analisis_NGain_${label.replace(/\s+/g, '_')}.xlsx`)
    }

    const exportCombined = () => {
        if (!statsA || !statsB) return alert('Kedua kelompok harus memiliki data')
        const wb = XLSX.utils.book_new()

        const perbandingan = [
            ['PERBANDINGAN KELOMPOK A vs KELOMPOK B'],
            [],
            ['Metrik', 'Kelompok A', 'Kelompok B'],
            ['Jumlah Responden', statsA.n, statsB.n],
            ['Rata-rata Pretest', +statsA.meanPretest.toFixed(2), +statsB.meanPretest.toFixed(2)],
            ['Rata-rata Posttest', +statsA.meanPosttest.toFixed(2), +statsB.meanPosttest.toFixed(2)],
            ['Rata-rata N-Gain', +statsA.meanGain.toFixed(4), +statsB.meanGain.toFixed(4)],
            ['SD N-Gain', +statsA.sdGain.toFixed(4), +statsB.sdGain.toFixed(4)],
            ['N-Gain Minimum', +statsA.minGain.toFixed(4), +statsB.minGain.toFixed(4)],
            ['N-Gain Maksimum', +statsA.maxGain.toFixed(4), +statsB.maxGain.toFixed(4)],
            ['Kategori', statsA.category, statsB.category],
            [],
            ['Distribusi Tinggi', statsA.distribution.Tinggi, statsB.distribution.Tinggi],
            ['Distribusi Sedang', statsA.distribution.Sedang, statsB.distribution.Sedang],
            ['Distribusi Rendah', statsA.distribution.Rendah, statsB.distribution.Rendah],
        ]
        const ws = XLSX.utils.aoa_to_sheet(perbandingan)
        ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }]
        XLSX.utils.book_append_sheet(wb, ws, 'Perbandingan')

        const sheetA = XLSX.utils.json_to_sheet(
            statsA.rows.map((r) => ({
                No: r.no, Nama: r.nama, Pretest: r.pretest, Posttest: r.posttest,
                'N-Gain': +r.gain.toFixed(4), Kategori: r.kategori,
            }))
        )
        XLSX.utils.book_append_sheet(wb, sheetA, 'Kelompok A')

        const sheetB = XLSX.utils.json_to_sheet(
            statsB.rows.map((r) => ({
                No: r.no, Nama: r.nama, Pretest: r.pretest, Posttest: r.posttest,
                'N-Gain': +r.gain.toFixed(4), Kategori: r.kategori,
            }))
        )
        XLSX.utils.book_append_sheet(wb, sheetB, 'Kelompok B')

        XLSX.writeFile(wb, 'Analisis_NGain_Perbandingan_AB.xlsx')
    }

    const downloadTemplate = () => {
        const wb = XLSX.utils.book_new()
        const template = [
            { Nama: 'Responden A1', Pretest: 5, Posttest: 13 },
            { Nama: 'Responden A2', Pretest: 7, Posttest: 14 },
        ]
        const ws = XLSX.utils.json_to_sheet(template)
        ws['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }]
        XLSX.utils.book_append_sheet(wb, ws, 'Template')
        XLSX.writeFile(wb, 'Template_Data_Pretest_Posttest.xlsx')
    }

    return (
        <div className="admin-comparison">
            <div className="admin-comparison-header">
                <div>
                    <h2>Evaluasi Perbandingan Efektivitas</h2>
                    <p className="admin-content-subtitle">
                        Analisis N-Gain Kelompok A vs Kelompok B (Skor maksimum: {MAX_SCORE})
                    </p>
                </div>
                <div className="header-actions">
                    <button className="export-btn" onClick={downloadTemplate}>
                        <FileSpreadsheet size={16} /> Template Excel
                    </button>
                    <button
                        className="export-btn primary"
                        onClick={exportCombined}
                        disabled={!statsA || !statsB}
                    >
                        <Download size={16} /> Ekspor Perbandingan
                    </button>
                </div>
            </div>

            <div className="upload-grid">
                <UploadCard
                    label="Kelompok A (Eksperimen)"
                    expected={91}
                    stats={statsA}
                    fileName={fileAName}
                    inputRef={inputARef}
                    onPick={() => inputARef.current?.click()}
                    onFile={(f) => handleUpload(f, setDataA, setFileAName)}
                    onExport={() => exportStats('Kelompok A', statsA)}
                    onClear={() => { setDataA([]); setFileAName('') }}
                    accent="cyan"
                />
                <UploadCard
                    label="Kelompok B (Kontrol)"
                    expected={90}
                    stats={statsB}
                    fileName={fileBName}
                    inputRef={inputBRef}
                    onPick={() => inputBRef.current?.click()}
                    onFile={(f) => handleUpload(f, setDataB, setFileBName)}
                    onExport={() => exportStats('Kelompok B', statsB)}
                    onClear={() => { setDataB([]); setFileBName('') }}
                    accent="violet"
                />
            </div>

            {(statsA || statsB) && (
                <div className="comparison-table-card">
                    <h3>Perbandingan Statistik</h3>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Metrik</th>
                                    <th>Kelompok A</th>
                                    <th>Kelompok B</th>
                                    <th>Selisih (A − B)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <CompareRow label="Jumlah Responden" a={statsA?.n} b={statsB?.n} />
                                <CompareRow label="Rata-rata Pretest" a={statsA?.meanPretest} b={statsB?.meanPretest} fmt={2} />
                                <CompareRow label="Rata-rata Posttest" a={statsA?.meanPosttest} b={statsB?.meanPosttest} fmt={2} />
                                <CompareRow label="Rata-rata N-Gain" a={statsA?.meanGain} b={statsB?.meanGain} fmt={4} />
                                <CompareRow label="SD N-Gain" a={statsA?.sdGain} b={statsB?.sdGain} fmt={4} />
                                <CompareRow label="N-Gain Minimum" a={statsA?.minGain} b={statsB?.minGain} fmt={4} />
                                <CompareRow label="N-Gain Maksimum" a={statsA?.maxGain} b={statsB?.maxGain} fmt={4} />
                                <tr>
                                    <td>Kategori N-Gain</td>
                                    <td>
                                        {statsA ? (
                                            <span className={`cat-badge cat-${statsA.category.toLowerCase()}`}>
                                                {statsA.category}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        {statsB ? (
                                            <span className={`cat-badge cat-${statsB.category.toLowerCase()}`}>
                                                {statsB.category}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

const UploadCard = ({
    label, expected, stats, fileName, inputRef,
    onPick, onFile, onExport, onClear, accent,
}) => (
    <div className={`upload-card accent-${accent}`}>
        <div className="upload-card-header">
            <div className="upload-card-title">
                <Users size={20} />
                <div>
                    <h4>{label}</h4>
                    <span className="upload-card-sub">Target: {expected} responden</span>
                </div>
            </div>
            {fileName && (
                <button className="icon-btn" onClick={onClear} title="Hapus data">
                    <Trash2 size={16} />
                </button>
            )}
        </div>

        <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            onChange={(e) => onFile(e.target.files?.[0])}
        />

        {!stats ? (
            <div className="upload-dropzone" onClick={onPick}>
                <Upload size={32} />
                <p>Klik untuk upload file Excel/CSV</p>
                <span>Kolom wajib: Nama, Pretest, Posttest</span>
            </div>
        ) : (
            <>
                <div className="file-chip">
                    <FileSpreadsheet size={14} />
                    <span>{fileName}</span>
                </div>
                <div className="stat-grid-mini">
                    <MiniStat label="Responden" value={stats.n} icon={<Users size={16} />} />
                    <MiniStat label="Rata Pretest" value={stats.meanPretest.toFixed(2)} icon={<BarChart3 size={16} />} />
                    <MiniStat label="Rata Posttest" value={stats.meanPosttest.toFixed(2)} icon={<TrendingUp size={16} />} />
                    <MiniStat label="Rata N-Gain" value={stats.meanGain.toFixed(3)} icon={<Percent size={16} />} highlight />
                    <MiniStat label="SD N-Gain" value={stats.sdGain.toFixed(3)} icon={<BarChart3 size={16} />} />
                    <MiniStat
                        label="Min / Max"
                        value={`${stats.minGain.toFixed(2)} / ${stats.maxGain.toFixed(2)}`}
                        icon={<Award size={16} />}
                    />
                </div>

                <div className="kategori-badge-row">
                    <span className={`cat-badge cat-${stats.category.toLowerCase()}`}>
                        Kategori: {stats.category}
                    </span>
                </div>

                <div className="dist-bar">
                    <div className="dist-item">
                        <span className="dist-label">Tinggi</span>
                        <span className="dist-value">{stats.distribution.Tinggi}</span>
                    </div>
                    <div className="dist-item">
                        <span className="dist-label">Sedang</span>
                        <span className="dist-value">{stats.distribution.Sedang}</span>
                    </div>
                    <div className="dist-item">
                        <span className="dist-label">Rendah</span>
                        <span className="dist-value">{stats.distribution.Rendah}</span>
                    </div>
                </div>

                <div className="upload-card-actions">
                    <button className="export-btn" onClick={onExport}>
                        <Download size={14} /> Ekspor Excel
                    </button>
                    <button className="export-btn" onClick={onPick}>
                        <RefreshCw size={14} /> Ganti File
                    </button>
                </div>
            </>
        )}
    </div>
)

const MiniStat = ({ label, value, icon, highlight }) => (
    <div className={`mini-stat ${highlight ? 'highlight' : ''}`}>
        <div className="mini-stat-icon">{icon}</div>
        <div>
            <div className="mini-stat-label">{label}</div>
            <div className="mini-stat-value">{value}</div>
        </div>
    </div>
)

const CompareRow = ({ label, a, b, fmt }) => {
    if (a == null && b == null) return null
    const aV = a != null ? (fmt ? a.toFixed(fmt) : a) : '-'
    const bV = b != null ? (fmt ? b.toFixed(fmt) : b) : '-'
    const diff = a != null && b != null ? (a - b).toFixed(fmt || 2) : '-'
    const diffClass =
        diff !== '-' && Number(diff) > 0
            ? 'diff-positive'
            : diff !== '-' && Number(diff) < 0
                ? 'diff-negative'
                : ''
    return (
        <tr>
            <td>{label}</td>
            <td>{aV}</td>
            <td>{bV}</td>
            <td className={diffClass}>{diff}</td>
        </tr>
    )
}

export default AdminComparison