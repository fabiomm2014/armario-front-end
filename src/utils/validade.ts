export type StatusValidade = "ok" | "atencao" | "vencido";

export interface InfoValidade {
  status: StatusValidade;
  diasRestantes: number;
  rotulo: string;
}

const LIMITE_ATENCAO_DIAS = 7;

export function calcularValidade(dataValidade: string): InfoValidade {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [ano, mes, dia] = dataValidade.split("-").map(Number);
  const validade = new Date(ano, mes - 1, dia);

  const diffMs = validade.getTime() - hoje.getTime();
  const diasRestantes = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diasRestantes < 0) {
    return {
      status: "vencido",
      diasRestantes,
      rotulo: `VENCIDO HÁ ${Math.abs(diasRestantes)}D`,
    };
  }

  if (diasRestantes <= LIMITE_ATENCAO_DIAS) {
    return {
      status: "atencao",
      diasRestantes,
      rotulo: diasRestantes === 0 ? "VENCE HOJE" : `VENCE EM ${diasRestantes}D`,
    };
  }

  return {
    status: "ok",
    diasRestantes,
    rotulo: `VENCE EM ${diasRestantes}D`,
  };
}

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
