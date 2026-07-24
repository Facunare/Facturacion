import { clienteRepository } from "../repositories/cliente.repository";
import { atencionRepository } from "../repositories/atencion.repository";
import { facturaRepository } from "../repositories/factura.repository";

export const dashboardService = {
  async getStats() {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const finMes = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [
      cantidadPacientes,
      cantidadAtenciones,
      cantidadPendiente,
      cantidadFacturada,
      montoPendiente,
      montoFacturadoMes,
      ingresosPorMes,
    ] = await Promise.all([
      clienteRepository.count(),
      atencionRepository.count(),
      facturaRepository.countByEstado("PENDIENTE"),
      facturaRepository.countByEstado("FACTURADO"),
      facturaRepository.sumImportePendiente(),
      facturaRepository.sumFacturadoEnRango(inicioMes, finMes),
      facturaRepository.ingresosPorMes(6),
    ]);

    return {
      cantidadPacientes,
      cantidadAtenciones,
      cantidadPendiente,
      cantidadFacturada,
      montoTotalPendiente: montoPendiente._sum.importe || 0,
      montoFacturadoEsteMes: montoFacturadoMes._sum.importeFacturado || 0,
      ingresosPorMes: ingresosPorMes.map((r) => ({ mes: r.mes, total: Number(r.total) })),
    };
  },
};
